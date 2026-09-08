interface PaginationProps {
  page: number;
  totalPages: number;
  total: number;
  limit: number;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
}

export function Pagination({
  page,
  totalPages,
  total,
  limit,
  onPageChange,
  onLimitChange,
}: PaginationProps) {
  const canPrevious = page > 1;
  const canNext = page < totalPages;

  return (
    <div className="ui-pagination">
      <div className="ui-pagination-info">
        <span>Rows per page</span>

        <select
          value={limit}
          onChange={(event) =>
            onLimitChange(Number(event.target.value))
          }
        >
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={20}>20</option>
        </select>

        <span>
          {total === 0
            ? "0 results"
            : `Page ${page} of ${totalPages}`}
        </span>
      </div>

      <div className="ui-pagination-actions">
        <button
          type="button"
          disabled={!canPrevious}
          onClick={() => onPageChange(page - 1)}
        >
          ←
        </button>

        <span>{page}</span>

        <button
          type="button"
          disabled={!canNext}
          onClick={() => onPageChange(page + 1)}
        >
          →
        </button>
      </div>
    </div>
  );
}