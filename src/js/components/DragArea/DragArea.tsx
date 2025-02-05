import { PropsWithChildren } from "react";
import styles from "./DragArea.module.scss";

type DragAreaProps = {
  htmlFor?: string;
};

export const DragArea = ({ children }: PropsWithChildren<DragAreaProps>) => {
  return <div className={styles.dragArea}>{children}</div>;
};
