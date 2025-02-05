import { AnchorHTMLAttributes, HTMLAttributes, PropsWithChildren } from "react";

type SpanProps = HTMLAttributes<HTMLElement>;

type ButtonProps = HTMLAttributes<HTMLButtonElement> & {
  onClick: () => void;
};
type LinkProps = AnchorHTMLAttributes<HTMLAnchorElement>;

export type ClickableProps = LinkProps | ButtonProps | SpanProps;

export const Clickable = (props: PropsWithChildren<ClickableProps>) => {
  function isLinkProps(
    props: PropsWithChildren<ClickableProps>
  ): props is LinkProps {
    return "to" in props;
  }

  function isButtonProps(
    props: PropsWithChildren<ClickableProps>
  ): props is ButtonProps {
    return "onClick" in props;
  }

  if (isLinkProps(props)) return <a {...props} />;
  if (isButtonProps(props)) return <button {...props} />;

  return <span {...props} />;
};
