import type { Customer } from "../../types/customer";

interface Props {
  customers: Customer[];
  onEdit: (customer: Customer) => void;
}

export default function CustomerTable({
  customers,
  onEdit,
}: Props) {
  return (
    <div className="customers-table-wrapper">
      <table className="customers-table">
        <thead>
          <tr>
            <th>Pelanggan</th>
            <th>Nomor HP</th>
            <th>Nama Panggilan</th>
            <th>Terdaftar</th>
            <th />
          </tr>
        </thead>

        <tbody>
          {customers.map((customer) => (
            <tr key={customer.id}>
              <td>
                <div className="customer-table-profile">
                  <div className="customer-table-avatar">
                    {customer.name
                      .charAt(0)
                      .toUpperCase()}
                  </div>

                  <div>
                    <strong>{customer.name}</strong>

                    <span>
                      ID {customer.id.slice(0, 8)}
                    </span>
                  </div>
                </div>
              </td>

              <td>
                <span className="customer-phone">
                  {customer.phone}
                </span>
              </td>

              <td>
                {customer.nickname ? (
                  <span className="nickname-pill">
                    {customer.nickname}
                  </span>
                ) : (
                  <span className="muted-text">-</span>
                )}
              </td>

              <td>
                <span className="customer-created">
                  {new Intl.DateTimeFormat("id-ID", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  }).format(new Date(customer.createdAt))}
                </span>
              </td>

              <td>
                <button
                  type="button"
                  className="customer-edit-button"
                  onClick={() => onEdit(customer)}
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