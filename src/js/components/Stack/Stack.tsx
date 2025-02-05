import { PropsWithChildren } from "react";
import styles from "./Stack.module.scss";
import classNames from "classnames";

type StackProps = {
  vertical?: boolean;
  horizontal?: boolean;
  className?: string;
};

export const Stack = ({
  children,
  vertical,
  horizontal,
  className,
}: PropsWithChildren<StackProps>) => {
  return (
    <div
      className={classNames(
        styles.stack,
        vertical && styles.vertical,
        horizontal && styles.horizontal,
        className
      )}
    >
      {children}
    </div>
  );
};
