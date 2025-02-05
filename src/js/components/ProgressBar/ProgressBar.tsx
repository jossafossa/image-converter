import { CSSProperties } from "react";
import styles from "./ProgressBar.module.scss";

export type ProgressBarProps = {
  total: number;
  value: number;
};

export const ProgressBar = ({ total, value }: ProgressBarProps) => {
  return (
    <div>
      <div
        className={styles.progress}
        style={{ "--value": value, "--total": total } as CSSProperties}
      ></div>
    </div>
  );
};
