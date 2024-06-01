import { motion } from "framer-motion";

import styles from "./Error.module.css";

type Props = {
  error: string;
};

export const Error = ({ error }: Props) => {
  return (
    <motion.div
      initial={{
        scale: 0,
        height: 0,
        opacity: 0,
      }}
      animate={{
        scale: 1,
        opacity: 1,
        height: "auto",
      }}
      exit={{
        scale: 0,
        height: 0,
        opacity: 0,
      }}
      className={styles.Error}
    >
      <span className={styles.Text}>{error}</span>
    </motion.div>
  );
};
