import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";
import { EmptyState } from "../../components/ui/EmptyState";

import { getService } from "../../services/api/services";
import type {
  ServiceDetail as ServiceDetailType,
  ServiceOrder,
} from "../../types/service";

function formatCurrency(value: number | string) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(Number(value));
}

function getStatusLabel(status: string) {
  const labels: Record<string, string> = {
    RECEIVED: "Diterima",
    WASHING: "Dicuci",
    DRYING: "Dikeringkan",
    IRONING: "Disetrika",
    READY: "Siap Diambil",
    PICKED_UP: "Selesai",
    CANCELLED: "Dibatalkan",
  };

  return labels[status] ?? status;
}

function getStatusVariant(status: string) {
  if (status === "READY") return "success";
  if (status === "PICKED_UP") return "success";
  if (status === "CANCELLED") return "danger";
  if (status === "RECEIVED") return "info";

  return "warning";
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

export default function ServiceDetail() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [service, setService] = useState<ServiceDetailType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;

    let cancelled = false;

    async function loadService() {
      try {
        if (!id) return;

        setLoading(true);
        setError("");

        const data = await getService(id);

        if (!cancelled) {
          setService(data);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : "Gagal mengambil detail service",
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void loadService();

    return () => {
      cancelled = true;
    };
  }, [id]);

  const stats = useMemo(() => {
    if (!service) {
      return {
        orders: 0,
        quantity: 0,
        revenue: 0,
      };
    }

    return service.orders.reduce(
      (result, order) => {
        result.orders += 1;
        result.quantity += order.quantity;
        result.revenue += Number(order.subtotal);

        return result;
      },
      {
        orders: 0,
        quantity: 0,
        revenue: 0,
      },
    );
  }, [service]);

  if (loading) {
    return (
      <div className="page service-detail-page">
        <div className="service-detail-loading">
          Memuat detail service...
        </div>
      </div>
    );
  }

  if (error || !service) {
    return (
      <div className="page service-detail-page">
        <div className="page-header">
          <div>
            <button
              type="button"
              className="back-link"
              onClick={() => navigate("/services")}
            >
              ← Kembali ke Services
            </button>

            <h1>Detail Service</h1>
          </div>
        </div>

        <Card className="service-detail-error">
          {error || "Service tidak ditemukan."}
        </Card>
      </div>
    );
  }

  return (
    <div className="page service-detail-page">
      <div className="page-header">
        <div>
          <button
            type="button"
            className="back-link"
            onClick={() => navigate("/services")}
          >
            ← Kembali ke Services
          </button>

          <div className="service-detail-title">
            <div>
              <h1>{service.name}</h1>

              <p>
                {service.description ||
                  "Tidak ada deskripsi untuk service ini."}
              </p>
            </div>

            <Badge variant={service.isActive ? "success" : "warning"}>
              {service.isActive ? "Aktif" : "Nonaktif"}
            </Badge>
          </div>
        </div>

        <Button
          variant="secondary"
          onClick={() => navigate(`/services/${service.id}/edit`)}
        >
          Edit Service
        </Button>
      </div>

      <div className="service-detail-stats">
        <Card>
          <span className="service-stat-label">Harga</span>
          <strong>{formatCurrency(service.price)}</strong>
          <small>per {service.unit || "unit"}</small>
        </Card>

        <Card>
          <span className="service-stat-label">Total Order</span>
          <strong>{stats.orders}</strong>
          <small>order menggunakan service</small>
        </Card>

        <Card>
          <span className="service-stat-label">Total Item</span>
          <strong>{stats.quantity}</strong>
          <small>item diproses</small>
        </Card>

        <Card>
          <span className="service-stat-label">Pendapatan</span>
          <strong>{formatCurrency(stats.revenue)}</strong>
          <small>dari service ini</small>
        </Card>
      </div>

      <Card className="service-orders-card no-padding">
        <div className="section-header service-orders-header">
          <div>
            <h3>Order yang Menggunakan Service</h3>
            <p>
              Riwayat order yang memiliki {service.name}.
            </p>
          </div>

          <span className="service-order-count">
            {service.orders.length} order
          </span>
        </div>

        {service.orders.length === 0 ? (
          <div className="service-empty-orders">
            <EmptyState
              title="Belum ada order"
              description="Belum ada order yang menggunakan service ini."
            />
          </div>
        ) : (
          <div className="service-orders-list">
            {service.orders.map((order: ServiceOrder) => (
              <button
                key={order.id}
                type="button"
                className="service-order-row"
                onClick={() => navigate(`/orders/${order.id}`)}
              >
                <div className="service-order-main">
                  <strong>#{order.orderNumber}</strong>

                  <span>
                    {order.customer.nickname || order.customer.name}
                  </span>
                </div>

                <div className="service-order-meta">
                  <span>
                    {order.quantity} {service.unit || "unit"}
                  </span>

                  <strong>
                    {formatCurrency(order.subtotal)}
                  </strong>
                </div>

                <div className="service-order-status">
                  <Badge variant={getStatusVariant(order.status)}>
                    {getStatusLabel(order.status)}
                  </Badge>

                  <small>{formatDate(order.createdAt)}</small>
                </div>

                <span className="service-order-arrow">
                  →
                </span>
              </button>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}