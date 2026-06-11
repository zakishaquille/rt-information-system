import React, { useState, useEffect } from "react";

interface CurrencyInputProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "onChange" | "value" | "type" | "inputMode"
> {
  value: number | string;
  onChange: (value: number | "") => void;
}

export const CurrencyInput: React.FC<CurrencyInputProps> = ({
  value,
  onChange,
  className,
  ...props
}) => {
  const [displayValue, setDisplayValue] = useState<string>("");

  useEffect(() => {
    if (value === undefined || value === null || value === "") {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setDisplayValue("");
      return;
    }

    const num = typeof value === "string" ? parseInt(value, 10) : value;
    if (isNaN(num)) {
      setDisplayValue("");
    } else {
      setDisplayValue(new Intl.NumberFormat("id-ID").format(num));
    }
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Remove non-digit characters
    const rawValue = e.target.value.replace(/\D/g, "");

    if (rawValue === "") {
      onChange("");
      setDisplayValue("");
      return;
    }

    const numValue = parseInt(rawValue, 10);
    onChange(numValue);

    setDisplayValue(new Intl.NumberFormat("id-ID").format(numValue));
  };

  return (
    <input
      type="text"
      inputMode="numeric"
      value={displayValue}
      onChange={handleChange}
      className={className}
      {...props}
    />
  );
};
