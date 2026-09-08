interface LoadingProps {
  text?: string;
}

export function Loading({ text = "Loading..." }: LoadingProps) {
  return (
    <div className="ui-loading">
      <span className="ui-spinner" />
      <span>{text}</span>
    </div>
  );
}