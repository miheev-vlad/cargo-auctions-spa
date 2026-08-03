import { forwardRef, type SelectHTMLAttributes, type ReactNode } from "react";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  children: ReactNode;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  function Select({ label, id, className, children, ...rest }, ref) {
    const selectId = id ?? rest.name;
    return (
      <label className="field" htmlFor={selectId}>
        {label && <span className="field__label">{label}</span>}
        <select
          ref={ref}
          id={selectId}
          className={`field__control ${className ?? ""}`}
          {...rest}
        >
          {children}
        </select>
      </label>
    );
  },
);
