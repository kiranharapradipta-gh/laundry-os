import type { ReactNode } from "react";

import { Loading } from "./Loading";

export interface TableColumn<T> {
  key: string;
  label: string;
  render?: (row: T) => ReactNode;
}

interface TableProps<T> {
  columns: TableColumn<T>[];
  data: T[];
  rowKey: (row: T) => string | number;
  loading?: boolean;
  empty?: ReactNode;
}

export function Table<T>({
  columns,
  data,
  rowKey,
  loading = false,
  empty,
}: TableProps<T>) {
  if (loading) {
    return (
      <div className="ui-table-state">
        <Loading text="Memuat data..." />
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="ui-table-state">
        {empty ?? (
          <span className="ui-table-empty-text">
            Tidak ada data.
          </span>
        )}
      </div>
    );
  }

  return (
    <div className="ui-table-wrapper">
      <table className="ui-table">
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column.key}>
                {column.label}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {data.map((row) => (
            <tr key={rowKey(row)}>
              {columns.map((column) => (
                <td key={column.key}>
                  {column.render
                    ? column.render(row)
                    : String(
                        row[
                          column.key as keyof T
                        ] ?? "",
                      )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}