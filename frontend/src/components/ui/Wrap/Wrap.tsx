import { classes } from "@/utils/classes";

import styles from "./Wrap.module.css";

type Props = {
  centered?: boolean;
  gapBetween?: number;
  children?: React.ReactNode;
};

export const Wrap = ({ children, gapBetween, centered }: Props) => {
  return (
    <div
      style={{ gap: gapBetween }}
      className={classes(styles.Wrap, centered && styles.Centered)}
    >
      {children}
    </div>
  );
};
