import { classes } from "@/utils/classes";

import styles from "./Bubble.module.css";

type Props = {
  text: string;
  answers?: string[];
  isSender?: boolean;
};

export const Bubble = ({ text, answers, isSender }: Props) => {
  return (
    <>
      <div className={classes(styles.Bubble, isSender && styles.Me)}>
        {text}
      </div>
      {answers && (
        <div className={styles.Variants}>
          {answers.map((answer, index) => (
            <div key={index} className={styles.Answer}>
              {answer}
            </div>
          ))}
        </div>
      )}
    </>
  );
};
