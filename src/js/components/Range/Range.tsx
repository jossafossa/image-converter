import { InputHTMLAttributes } from "react";
import { Label } from "../Label";

type RangeProps<T> = {
  onChange: (value: T) => void;
  value: T;
  label?: string;
} & Omit<InputHTMLAttributes<HTMLInputElement>, "onChange">;

export function Range<T>({
  value,
  name,
  label,
  onChange,
  ...props
}: RangeProps<T>) {
  return (
    <Label name={name} label={label}>
      <input
        onChange={(e) => onChange(parseFloat(e.target.value) as T)}
        id={name}
        type="range"
        name={name}
        value={value}
        {...props}
      />
      {value}
    </Label>
  );
}
