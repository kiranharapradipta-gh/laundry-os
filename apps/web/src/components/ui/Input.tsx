import type { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function Input({
  label,
  error,
  className = "",
  id,
  ...props
}: InputProps) {
  const inputId = id ?? `input-${props.name ?? "field"}`;

  return (
    <div className="ui-field">
      {label && (
        <label htmlFor={inputId} className="ui-label">
          {label}
        </label>
      )}

      <input
        {...props}
        id={inputId}
        className={`ui-input ${error ? "has-error" : ""} ${className}`.trim()}
      />

      {error && <span className="ui-field-error">{error}</span>}
    </div>
  );
}