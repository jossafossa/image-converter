import { PropsWithChildren } from "react";
import styles from "./Label.module.scss";

type LabelProps = {
  name?: string;
  label?: string;
};

export const Label = ({
  name,
  label,
  children,
}: PropsWithChildren<LabelProps>) => {
  return (
    <label htmlFor={name} className={styles.wrapper}>
      <span className={styles.label}>{label}</span>
      {children}
    </label>
  );
};
