import { classes } from "@/utils/classes";

import styles from "./Button.module.css";

type Props = {
  icon?: React.ReactNode;
  label?: string;
};

export const Button = ({ icon, label }: Props) => {
  return (
    <button className={classes(styles.Button, label && styles.Full)}>
      {label}
      {icon}
    </button>
  );
};
