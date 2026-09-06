import type { StorageLocation } from "../../types/storage";
import { formatDate } from "../../utils/format";

interface StorageTableProps {
  locations: StorageLocation[];
  onEdit: (location: StorageLocation) => void;
  onToggle: (location: StorageLocation) => void;
}

function getLocationLabel(location: StorageLocation) {
  const parts = [
    location.zone,
    location.rack,
    location.shelf,
    location.slot,
  ].filter(Boolean);

  return parts.length > 0 ? parts.join(" / ") : "Belum diatur";
}

function getInitial(location: StorageLocation) {
  return (
    location.zone?.charAt(0).toUpperCase() ||
    location.rack?.charAt(0).toUpperCase() ||
    "S"
  );
}

function getActiveAssignment(location: StorageLocation) {
  return location.assignments?.[0] ?? null;
}

export default function StorageTable({
  locations,
  onEdit,
  onToggle,
}: StorageTableProps) {
  return (
    <div className="storage-table-wrap">
      <table className="storage-table">
        <thead>
          <tr>
            <th>Lokasi</th>
            <th>Zone</th>
            <th>Rak</th>
            <th>Shelf</th>
            <th>Slot</th>
            <th>Status</th>
            <th>Penggunaan</th>
            <th>Dibuat</th>
            <th>Aksi</th>
          </tr>
        </thead>

        <tbody>
          {locations.map((location) => (
            <tr key={location.id}>
              <td>
                <div className="storage-location-cell">
                  <div className="storage-icon">
                    {getInitial(location)}
                  </div>

                  <div className="storage-location-info">
                    <strong>{getLocationLabel(location)}</strong>

                    <span>
                      ID: {location.id.slice(0, 8)}
                    </span>
                  </div>
                </div>
              </td>

              <td>
                <span className="storage-value">
                  {location.zone || "—"}
                </span>
              </td>

              <td>
                <span className="storage-value">
                  {location.rack || "—"}
                </span>
              </td>

              <td>
                <span className="storage-value">
                  {location.shelf || "—"}
                </span>
              </td>

              <td>
                <span className="storage-slot">
                  {location.slot || "—"}
                </span>
              </td>

              <td>
                <button
                  type="button"
                  className={`storage-status ${
                    location.isActive
                      ? "active"
                      : "inactive"
                  }`}
                  onClick={() => onToggle(location)}
                >
                  <span className="storage-status-dot" />
                  {location.isActive
                    ? "Aktif"
                    : "Nonaktif"}
                </button>
              </td>

              <td>
                {(() => {
                  const assignment = getActiveAssignment(location);

                  if (!assignment) {
                    return (
                      <div className="storage-occupancy empty">
                        <span className="storage-occupancy-dot" />
                        <div>
                          <strong>Kosong</strong>
                          <span>Belum ada order</span>
                        </div>
                      </div>
                    );
                  }

                  return (
                    <div className="storage-occupancy occupied">
                      <span className="storage-occupancy-dot" />

                      <div>
                        <strong>{assignment.order.orderNumber}</strong>

                        <span>
                          {assignment.order.customer?.nickname ||
                            assignment.order.customer?.name ||
                            "Customer"}
                        </span>
                      </div>
                    </div>
                  );
                })()}
              </td>

              <td>
                <span className="storage-date">
                  {formatDate(location.createdAt)}
                </span>
              </td>

              <td>
                <button
                  type="button"
                  className="storage-edit-btn"
                  onClick={() => onEdit(location)}
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