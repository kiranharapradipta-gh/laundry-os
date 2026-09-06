import type { Order } from "../../../types/order";
import { formatDateTime, formatRupiah } from "../../../utils/format";
import OrderStatusBadge from "./OrderStatusBadge";

interface Props {
  orders: Order[];
  onSelect: (order: Order) => void;
}

export default function OrderTable({ orders, onSelect }: Props) {
  return (
    <div className="orders-table-wrapper">
      <table className="orders-table">
        <thead>
          <tr>
            <th>Order</th>
            <th>Pelanggan</th>
            <th>Layanan</th>
            <th>Total</th>
            <th>Status</th>
            <th>Tanggal</th>
            <th />
          </tr>
        </thead>

        <tbody>
          {orders.map((order) => {
            const itemCount = order.items?.length ?? 0;

            return (
              <tr
                key={order.id}
                onClick={() => onSelect(order)}
                className="order-row"
              >
                <td>
                  <div className="order-number">
                    #{order.orderNumber}
                  </div>

                  <div className="order-id">
                    {itemCount} item
                  </div>
                </td>

                <td>
                  <div className="customer-cell">
                    <div className="customer-avatar">
                      {(order.customer?.name || "?")
                        .charAt(0)
                        .toUpperCase()}
                    </div>

                    <div>
                      <strong>
                        {order.customer?.name || "Pelanggan"}
                      </strong>

                      <span>
                        {order.customer?.phone || "-"}
                      </span>
                    </div>
                  </div>
                </td>

                <td>
                  <div className="service-cell">
                    {order.items?.[0]?.service?.name || "-"}
                    {itemCount > 1 && (
                      <span>+{itemCount - 1} lainnya</span>
                    )}
                  </div>
                </td>

                <td>
                  <strong className="order-total">
                    {formatRupiah(Number(order.total))}
                  </strong>

                  <span className="payment-status">
                    {order.paymentStatus === "PAID"
                      ? "Lunas"
                      : order.paymentStatus === "PARTIAL"
                        ? "Sebagian"
                        : "Belum bayar"}
                  </span>
                </td>

                <td>
                  <OrderStatusBadge status={order.status} />
                </td>

                <td>
                  <span className="order-date">
                    {formatDateTime(order.createdAt)}
                  </span>
                </td>

                <td>
                  <button
                    type="button"
                    className="table-action"
                    onClick={(event) => {
                      event.stopPropagation();
                      onSelect(order);
                    }}
                  >
                    →
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}