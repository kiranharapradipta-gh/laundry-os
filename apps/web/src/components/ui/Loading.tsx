interface LoadingProps {
  text?: string;
}

export function Loading({
  text = "Memuat data...",
}: LoadingProps) {
  return (
    <div className="ui-loading" role="status" aria-live="polite">
      <span className="ui-spinner" aria-hidden="true" />
      <span className="ui-loading-text">{text}</span>
    </div>
  );
}