import { Clickable, type ClickableProps } from "../Clickable";
import { PropsWithChildren } from "react";
import styles from "./Button.module.scss";
type ButtonProps = {
  children: React.ReactNode;
} & ClickableProps;

export const Button = ({
  children,
  ...clickable
}: PropsWithChildren<ButtonProps>) => {
  return (
    <Clickable className={styles.button} {...clickable}>
      {children}
    </Clickable>
  );
};
