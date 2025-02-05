import { HTMLProps } from "react";
import { Label } from "../Label";
import styles from "./Select.module.scss";

type SelectOption<T> = {
  value: T;
  label: string;
};

type SelectProps<T> = {
  value: T;
  name: string;
  options: SelectOption<T>[];
  label?: string;
  onChange: (value: T) => void;
} & Omit<HTMLProps<HTMLSelectElement>, "onChange">;

export function Select<T>({
  value,
  options,
  label,
  name,
  onChange,
  ...props
}: SelectProps<T>) {
  return (
    <Label name={name} label={label}>
      <select
        className={styles.select}
        value={options.findIndex((option) => option.value === value)}
        name={name}
        id={name}
        onChange={(e) => {
          const index = Number(e.target.value);
          if (index >= 0) {
            onChange(options[index].value);
          }
        }}
        {...props}
      >
        {options.map(({ label }, index) => (
          <option key={index} value={index}>
            {label}
          </option>
        ))}
      </select>
    </Label>
  );
}
