import { classes } from "@/utils/classes";

import styles from "./Button.module.css";

type Props = {
  icon?: React.ReactNode;
  label?: string;
  onClick?: () => void;
};

export const Button = ({ icon, label, onClick }: Props) => {
  return (
    <button
      className={classes(styles.Button, label && styles.Full)}
      onClick={onClick}
    >
      {label}
      {icon}
    </button>
  );
};
