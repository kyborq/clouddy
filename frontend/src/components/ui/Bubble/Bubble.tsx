import { classes } from "@/utils/classes";

import styles from "./Bubble.module.css";
import { motion } from "framer-motion";

type Props = {
  text: string;
  answers?: string[];
  isSender?: boolean;
  attachment?: string;
  onAction?: (id: number) => void;
};

export const Bubble = ({
  text,
  answers,
  isSender,
  attachment,
  onAction,
}: Props) => {
  return (
    <>
      <motion.div
        layout
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className={classes(styles.Bubble, isSender && styles.Me)}
      >
        {text}
        {!!attachment && <img src={attachment} className={styles.Attachment} />}
      </motion.div>
      {answers && (
        <div className={styles.Variants}>
          {answers.map((answer, index) => (
            <div
              key={index}
              className={styles.Answer}
              onClick={() => onAction && onAction(index)}
            >
              {answer}
            </div>
          ))}
        </div>
      )}
    </>
  );
};
