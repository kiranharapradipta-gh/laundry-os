import type { SelectHTMLAttributes } from "react";

export interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps
  extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options?: SelectOption[];
}

export function Select({
  label,
  options,
  className = "",
  id,
  children,
  ...props
}: SelectProps) {
  const selectId = id ?? props.name;

  return (
    <div className="ui-field">
      {label && (
        <label htmlFor={selectId} className="ui-label">
          {label}
        </label>
      )}

      <select
        id={selectId}
        className={`ui-select ${className}`.trim()}
        {...props}
      >
        {options
          ? options.map((option) => (
              <option
                key={option.value}
                value={option.value}
              >
                {option.label}
              </option>
            ))
          : children}
      </select>
    </div>
  );
}