import type { LaundryService } from "../../types/service";
import { formatRupiah } from "../../utils/format";

interface ServiceTableProps {
  services: LaundryService[];
  onEdit: (service: LaundryService) => void;
  onToggle: (service: LaundryService) => void;
}

export default function ServiceTable({
  services,
  onEdit,
  onToggle,
}: ServiceTableProps) {
  return (
    <div className="services-table-wrap">
      <table className="services-table">
        <thead>
          <tr>
            <th>Layanan</th>
            <th>Harga</th>
            <th>Satuan</th>
            <th>Status</th>
            <th>Aksi</th>
          </tr>
        </thead>

        <tbody>
          {services.map((service) => (
            <tr key={service.id}>
              <td>
                <div className="service-name-cell">
                  <div className="service-icon">
                    {service.name.charAt(0).toUpperCase()}
                  </div>

                  <div>
                    <strong>{service.name}</strong>

                    {service.description && (
                      <span>{service.description}</span>
                    )}
                  </div>
                </div>
              </td>

              <td>
                <strong className="service-price">
                  {formatRupiah(Number(service.price))}
                </strong>
              </td>

              <td>
                <span className="service-unit">
                  {service.unit || "—"}
                </span>
              </td>

              <td>
                <button
                  type="button"
                  className={`service-status ${
                    service.isActive ? "active" : "inactive"
                  }`}
                  onClick={() => onToggle(service)}
                  title={
                    service.isActive
                      ? "Klik untuk menonaktifkan"
                      : "Klik untuk mengaktifkan"
                  }
                >
                  <span className="service-status-dot" />
                  {service.isActive ? "Aktif" : "Nonaktif"}
                </button>
              </td>

              <td>
                <button
                  type="button"
                  className="service-edit-btn"
                  onClick={() => onEdit(service)}
                >
                  Edit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}