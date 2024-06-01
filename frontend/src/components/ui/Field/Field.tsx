// import { ChangeEventHandler } from "react";
import TextareaAutosize from "react-textarea-autosize";

import styles from "./Field.module.css";

// type Props = {
//   label?: string;
//   icon?: React.ReactNode;
//   placeholder?: string;
//   name?: string;
//   value?: string;
//   obscure?: boolean;
//   onChange?: ChangeEventHandler<HTMLInputElement>;
// };

export const Field = () => {
  return (
    <label className={styles.Container}>
      <TextareaAutosize className={styles.Input} />
    </label>
  );
};
