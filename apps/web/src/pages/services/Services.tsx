import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Badge,
  Button,
  Card,
  EmptyState,
  Select,
  Table,
} from "../../components/ui";

import { getServices } from "../../services/api/services";

import type { Service } from "../../types/service";

import {
  formatServicePrice,
  getServiceUnitLabel,
} from "../../utils/service";

type ServiceFilter = "ALL" | "ACTIVE" | "INACTIVE";

export function Services() {
  const navigate = useNavigate();

  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [filter, setFilter] =
    useState<ServiceFilter>("ALL");

  const loadServices = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getServices(true);

      setServices(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Gagal mengambil data service.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadServices();
  }, [loadServices]);

  const filteredServices = useMemo(() => {
    if (filter === "ACTIVE") {
      return services.filter(
        (service) => service.isActive !== false,
      );
    }

    if (filter === "INACTIVE") {
      return services.filter(
        (service) => service.isActive === false,
      );
    }

    return services;
  }, [services, filter]);

  const activeCount = useMemo(
    () =>
      services.filter(
        (service) => service.isActive !== false,
      ).length,
    [services],
  );

  const inactiveCount = services.length - activeCount;

  return (
    <div className="page services-page">
      <div className="services-hero">
        <div className="services-hero-content">
          <div className="services-hero-icon">
            ✦
          </div>

          <div className="services-hero-text">
            <span className="services-eyebrow">
              Manajemen Laundry
            </span>

            <h1>Services</h1>

            <p>
              Kelola layanan, harga, dan status service
              yang tersedia untuk pelanggan.
            </p>
          </div>
        </div>

        <Button
          onClick={() => navigate("/services/new")}
          className="services-add-button"
        >
          + Tambah Service
        </Button>
      </div>

      <div className="services-stats">
        <Card className="services-stat-card">
          <div className="services-stat-icon">
            ◎
          </div>

          <div className="services-stat-content">
            <span>Total Service</span>

            <strong>{services.length}</strong>

            <small>
              Semua layanan
            </small>
          </div>
        </Card>

        <Card className="services-stat-card">
          <div className="services-stat-icon active">
            ✓
          </div>

          <div className="services-stat-content">
            <span>Service Aktif</span>

            <strong>{activeCount}</strong>

            <small>
              Tersedia untuk order
            </small>
          </div>
        </Card>

        <Card className="services-stat-card">
          <div className="services-stat-icon inactive">
            —
          </div>

          <div className="services-stat-content">
            <span>Service Nonaktif</span>

            <strong>{inactiveCount}</strong>

            <small>
              Tidak tersedia
            </small>
          </div>
        </Card>
      </div>

      <Card className="no-padding">
        <div className="section-header table-section-header">
          <div className="section-header-content">
            <h3>Daftar Service</h3>

            <p>
              {filteredServices.length} service
              ditampilkan.
            </p>
          </div>

          <div className="section-header-action">
            <Select
              value={filter}
              onChange={(event) =>
                setFilter(
                  event.target.value as ServiceFilter,
                )
              }
              options={[
                {
                  value: "ALL",
                  label: "Semua Service",
                },
                {
                  value: "ACTIVE",
                  label: "Aktif",
                },
                {
                  value: "INACTIVE",
                  label: "Nonaktif",
                },
              ]}
            />
          </div>
        </div>

        {error ? (
          <EmptyState
            title="Gagal mengambil service"
            description={error}
            action={
              <Button
                variant="secondary"
                onClick={() => void loadServices()}
              >
                Coba Lagi
              </Button>
            }
          />
        ) : (
          <Table<Service>
            loading={loading}
            data={filteredServices}
            rowKey={(service) => service.id}
            empty={
              <EmptyState
                title="Belum ada service"
                description="Tambahkan service pertama untuk mulai membuat order."
                action={
                  <Button
                    onClick={() =>
                      navigate("/services/new")
                    }
                  >
                    + Tambah Service
                  </Button>
                }
              />
            }
            columns={[
              {
                key: "name",
                label: "Service",
                render: (service) => (
                  <div className="table-primary">
                    <button
                      type="button"
                      className="service-name-link"
                      onClick={() =>
                        navigate(`/services/${service.id}`)
                      }
                    >
                      {service.name}
                    </button>

                    {service.description && (
                      <span>{service.description}</span>
                    )}
                  </div>
                ),
              },
              {
                key: "price",
                label: "Harga",
                render: (service) =>
                  formatServicePrice(service),
              },
              {
                key: "unit",
                label: "Satuan",
                render: (service) =>
                  getServiceUnitLabel(service.unit),
              },
              {
                key: "status",
                label: "Status",
                render: (service) => (
                  <Badge
                    variant={
                      service.isActive !== false
                        ? "success"
                        : "default"
                    }
                  >
                    {service.isActive !== false
                      ? "Aktif"
                      : "Nonaktif"}
                  </Badge>
                ),
              },
            ]}
          />
        )}
      </Card>
    </div>
  );
}