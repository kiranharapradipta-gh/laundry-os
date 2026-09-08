import type { ReactNode } from "react";

interface EmptyStateProps {
  title: string;
  description?: string;
  action?: ReactNode;
}

export function EmptyState({
  title,
  description,
  action,
}: EmptyStateProps) {
  return (
    <div className="ui-empty">
      <div className="ui-empty-icon" aria-hidden="true">
        <span />
      </div>

      <div className="ui-empty-content">
        <strong>{title}</strong>

        {description && <p>{description}</p>}
      </div>

      {action && (
        <div className="ui-empty-action">
          {action}
        </div>
      )}
    </div>
  );
}