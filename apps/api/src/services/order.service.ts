import crypto from "node:crypto";
import { prisma } from "../config/database.js";
import { createSignedUrl } from "./file-storage.service.js";
import {
  sendOrderCreatedNotification,
  sendOrderStatusNotification,
  sendOrderReadyNotification
} from "./notification.service.js";

interface CreateOrderItemInput {
  serviceId?: string;
  description: string;
  quantity: number;
  notes?: string;
}

interface CreateOrderInput {
  customerId: string;
  storageLocationId?: string;
  discount?: number;
  notes?: string;
  items: CreateOrderItemInput[];
}

interface UpdateOrderStatusInput {
  status:
    | "RECEIVED"
    | "WASHING"
    | "DRYING"
    | "IRONING"
    | "READY"
    | "PICKED_UP"
    | "CANCELLED";

  note?: string;
}

function generateOrderNumber() {
  const date = new Date();

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  const random = crypto
    .randomBytes(3)
    .toString("hex")
    .toUpperCase();

  return `ORD-${year}${month}${day}-${random}`;
}

function generateQrToken() {
  return crypto.randomBytes(32).toString("hex");
}

// ========================================
// CREATE ORDER
// ========================================

export async function createOrder(
  businessId: string,
  createdById: string,
  input: CreateOrderInput
) {
  if (!input.items || input.items.length === 0) {
    throw new Error(
      "Order harus memiliki minimal satu item"
    );
  }

  // ========================================
  // CUSTOMER
  // ========================================

  const customer = await prisma.customer.findFirst({
    where: {
      id: input.customerId,
      businessId,
    },
  });

  if (!customer) {
    throw new Error("Customer tidak ditemukan");
  }

  // ========================================
  // STORAGE
  // ========================================

  if (input.storageLocationId) {
    const storage = await prisma.storageLocation.findFirst({
      where: {
        id: input.storageLocationId,
        businessId,
        isActive: true,
      },
    });

    if (!storage) {
      throw new Error(
        "Storage location tidak ditemukan atau tidak aktif"
      );
    }
  }

  // ========================================
  // SERVICES
  // ========================================

  const serviceIds = input.items
    .map((item) => item.serviceId)
    .filter((id): id is string => Boolean(id));

  const services = await prisma.service.findMany({
    where: {
      id: {
        in: serviceIds,
      },
      businessId,
      isActive: true,
    },
  });

  const serviceMap = new Map(
    services.map((service) => [
      service.id,
      service,
    ])
  );

  // ========================================
  // CALCULATE ITEMS
  // ========================================

  let subtotal = 0;

  const processedItems = input.items.map((item) => {
    let unitPrice = 0;

    if (item.serviceId) {
      const service = serviceMap.get(
        item.serviceId
      );

      if (!service) {
        throw new Error(
          `Service tidak ditemukan: ${item.serviceId}`
        );
      }

      unitPrice = Number(service.price);
    }

    if (item.quantity <= 0) {
      throw new Error(
        "Quantity harus lebih besar dari 0"
      );
    }

    const itemSubtotal =
      unitPrice * item.quantity;

    subtotal += itemSubtotal;

    return {
      serviceId: item.serviceId ?? null,

      description: item.description,

      quantity: item.quantity,

      unitPrice,

      subtotal: itemSubtotal,

      notes: item.notes ?? null,
    };
  });

  // ========================================
  // DISCOUNT
  // ========================================

  const discount = input.discount ?? 0;

  if (discount < 0) {
    throw new Error(
      "Discount tidak boleh negatif"
    );
  }

  if (discount > subtotal) {
    throw new Error(
      "Discount tidak boleh lebih besar dari subtotal"
    );
  }

  const total = subtotal - discount;

  // ========================================
  // QR
  // ========================================

  const qrToken = generateQrToken();

  // ========================================
  // ORDER NUMBER
  // ========================================

  const orderNumber = generateOrderNumber();

  // ========================================
  // CREATE EVERYTHING
  // ========================================

  const order = await prisma.$transaction(
    async (tx) => {
      // ------------------------------------
      // ORDER
      // ------------------------------------

      const createdOrder =
        await tx.order.create({
          data: {
            businessId,
            customerId: input.customerId,
            createdById,

            orderNumber,

            status: "RECEIVED",
            paymentStatus: "UNPAID",

            subtotal,
            discount,
            total,
            paidAmount: 0,

            notes: input.notes ?? null,

            // --------------------------------
            // ITEMS
            // --------------------------------

            items: {
              create: processedItems,
            },
          },
        });

      // ------------------------------------
      // QR CODE
      // ------------------------------------

      await tx.qRCode.create({
        data: {
          businessId,
          orderId: createdOrder.id,

          type: "ORDER",

          token: qrToken,
        },
      });

      // ------------------------------------
      // STATUS HISTORY
      // ------------------------------------

      await tx.orderStatusHistory.create({
        data: {
          orderId: createdOrder.id,

          changedById: createdById,

          fromStatus: null,

          toStatus: "RECEIVED",

          note: "Order dibuat",
        },
      });

      // ------------------------------------
      // STORAGE
      // ------------------------------------

      if (input.storageLocationId) {
        await tx.storageAssignment.create({
          data: {
            orderId: createdOrder.id,

            storageLocationId:
              input.storageLocationId,

            assignedById: createdById,
          },
        });
      }

      return createdOrder;
    }
  );

  // ========================================
  // WHATSAPP NOTIFICATION
  // ========================================

  if (customer.phone) {
    try {
      await sendOrderCreatedNotification(
        customer.phone,
        customer.nickname || customer.name,
        order.orderNumber,
        total
      );
    } catch (error) {
      console.error(
        "⚠️ Gagal mengirim notifikasi WhatsApp:",
        error
      );
    }
  }

  // ========================================
  // RETURN COMPLETE ORDER
  // ========================================

  return prisma.order.findUnique({
    where: {
      id: order.id,
    },

    include: {
      customer: true,

      items: {
        include: {
          service: true,
        },
      },

      qrCodes: true,

      statusHistory: {
        orderBy: {
          createdAt: "asc",
        },
      },

      storageAssignments: {
        include: {
          storageLocation: true,
        },
      },
    },
  });
}

// ========================================
// GET ORDERS
// ========================================

export interface GetOrdersOptions {
  search?: string;
  status?: string;
  page?: number;
  limit?: number;
}

export async function getOrders(
  businessId: string,
  options: GetOrdersOptions = {}
) {
  const search =
    options.search?.trim() || "";

  const page = Math.max(
    1,
    options.page ?? 1
  );

  const limit = Math.min(
    100,
    Math.max(
      1,
      options.limit ?? 20
    )
  );

  const skip =
    (page - 1) * limit;

  const where = {
    businessId,

    ...(options.status &&
      options.status !== "ALL"
      ? {
          status:
            options.status as
              | "RECEIVED"
              | "WASHING"
              | "DRYING"
              | "IRONING"
              | "READY"
              | "PICKED_UP"
              | "CANCELLED",
        }
      : {}),

    ...(search
      ? {
          OR: [
            {
              orderNumber: {
                contains: search,
                mode: "insensitive" as const,
              },
            },
            {
              customer: {
                name: {
                  contains: search,
                  mode: "insensitive" as const,
                },
              },
            },
            {
              customer: {
                nickname: {
                  contains: search,
                  mode: "insensitive" as const,
                },
              },
            },
            {
              customer: {
                phone: {
                  contains: search,
                },
              },
            },
          ],
        }
      : {}),
  };

  const [
    orders,
    total,
  ] = await prisma.$transaction([
    prisma.order.findMany({
      where,

      include: {
        customer: true,

        items: {
          include: {
            service: true,
          },
        },

        qrCodes: true,

        statusHistory: {
          orderBy: {
            createdAt: "asc",
          },
        },

        storageAssignments: {
          where: {
            releasedAt: null,
          },
          include: {
            storageLocation: true,
          },
        },
      },

      orderBy: {
        createdAt: "desc",
      },

      skip,
      take: limit,
    }),

    prisma.order.count({
      where,
    }),
  ]);

  return {
    data: orders,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(
        total / limit
      ),
    },
  };
}

// ========================================
// GET ORDER BY ID
// ========================================

export async function getOrderById(
  businessId: string,
  orderId: string
) {
  const order = await prisma.order.findFirst({
    where: {
      id: orderId,
      businessId,
    },

    include: {
      customer: true,

      items: {
        include: {
          service: true,
          photos: true,
        },
      },

      qrCodes: true,

      statusHistory: {
        orderBy: {
          createdAt: "asc",
        },
      },

      storageAssignments: {
        where: {
          releasedAt: null,
        },

        include: {
          storageLocation: true,
        },
      },

      payments: true,

      complaints: true,
    },
  });

  if (!order) {
    return null;
  }

  const items = await Promise.all(
    order.items.map(async (item) => {
      const photos = await Promise.all(
        item.photos.map(async (photo) => {
          if (!photo.storageKey) {
            return photo;
          }

          const signedUrl =
            await createSignedUrl(
              photo.storageKey,
              60 * 15
            );

          return {
            ...photo,
            url: signedUrl,
          };
        })
      );

      return {
        ...item,
        photos,
      };
    })
  );

  return {
    ...order,
    items,
  };
}

// export async function getOrderById(
//   businessId: string,
//   orderId: string
// ) {
//   return prisma.order.findFirst({
//     where: {
//       id: orderId,
//       businessId,
//     },

//     include: {
//       customer: true,

//       items: {
//         include: {
//           service: true,
//           photos: true,
//         },
//       },

//       qrCodes: true,

//       statusHistory: {
//         orderBy: {
//           createdAt: "asc",
//         },
//       },

//       storageAssignments: {
//         where: {
//           releasedAt: null,
//         },

//         include: {
//           storageLocation: true,
//         },
//       },

//       payments: true,

//       complaints: true,
//     },
//   });
// }

function validateStatusTransition(
  currentStatus: UpdateOrderStatusInput["status"],
  nextStatus: UpdateOrderStatusInput["status"]
) {
  const allowedTransitions: Record<
    UpdateOrderStatusInput["status"],
    UpdateOrderStatusInput["status"][]
  > = {
    RECEIVED: ["WASHING", "CANCELLED"],
    WASHING: ["DRYING", "CANCELLED"],
    DRYING: ["IRONING", "CANCELLED"],
    IRONING: ["READY", "CANCELLED"],
    READY: ["PICKED_UP", "CANCELLED"],
    PICKED_UP: [],
    CANCELLED: [],
  };

  if (!allowedTransitions[currentStatus].includes(nextStatus)) {
    throw new Error(
      `Status tidak dapat diubah dari ${currentStatus} ke ${nextStatus}`
    );
  }
}

// ========================================
// UPDATE STATUS
// ========================================

export async function updateOrderStatus(
  businessId: string,
  orderId: string,
  changedById: string,
  input: UpdateOrderStatusInput
) {
  const order = await prisma.order.findFirst({
    where: {
      id: orderId,
      businessId,
    },
  });

  if (!order) {
    throw new Error("Order tidak ditemukan");
  }

  validateStatusTransition(
    order.status,
    input.status
  );

  const now = new Date();

  const updateData: {
    status: UpdateOrderStatusInput["status"];
    readyAt?: Date;
    pickedUpAt?: Date;
    cancelledAt?: Date;
  } = {
    status: input.status,
  };

  if (input.status === "READY") {
    updateData.readyAt = now;
  }

  if (input.status === "PICKED_UP") {
    updateData.pickedUpAt = now;
  }

  if (input.status === "CANCELLED") {
    updateData.cancelledAt = now;
  }

  const updatedOrder =
    await prisma.$transaction(
      async (tx) => {
        // ------------------------------------
        // UPDATE ORDER
        // ------------------------------------

        const updatedOrder =
          await tx.order.update({
            where: {
              id: orderId,
            },

            data: updateData,
          });

        // ------------------------------------
        // STATUS HISTORY
        // ------------------------------------

        await tx.orderStatusHistory.create({
          data: {
            orderId,

            changedById,

            fromStatus: order.status,

            toStatus: input.status,

            note: input.note ?? null,
          },
        });

        // ------------------------------------
        // RELEASE STORAGE
        // ------------------------------------

        if (
          input.status === "PICKED_UP" ||
          input.status === "CANCELLED"
        ) {
          await tx.storageAssignment.updateMany({
            where: {
              orderId,
              releasedAt: null,
            },

            data: {
              releasedAt: now,
            },
          });
        }

        return updatedOrder;
      }
    );

  // ========================================
  // WHATSAPP NOTIFICATION
  // ========================================

  const customer = await prisma.customer.findFirst({
      where: {
        id: order.customerId,
        businessId,
      },
    });

  if (customer?.phone) {
    try {
      if (input.status === "READY") {
        const qrCode =
          await prisma.qRCode.findFirst({
            where: {
              orderId: order.id,
              type: "ORDER",
              isActive: true,
            },
          });

        if (!qrCode) {
          throw new Error(
            "QR Order tidak ditemukan"
          );
        }

        await sendOrderReadyNotification(
          customer.phone,
          customer.nickname ||
            customer.name,
          updatedOrder.orderNumber,
          qrCode.token
        );
      } else {
        await sendOrderStatusNotification(
          customer.phone,
          customer.nickname ||
            customer.name,
          updatedOrder.orderNumber,
          input.status
        );
      }
    } catch (error) {
      console.error(
        "⚠️ Gagal mengirim notifikasi WhatsApp:",
        error
      );
    }
  }

  return updatedOrder;
}