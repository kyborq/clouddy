import { forwardRef } from "react";
import { UseFormRegister } from "react-hook-form";
import TextareaAutosize from "react-textarea-autosize";

import styles from "./Field.module.css";

type Props = {
  icon?: React.ReactNode;
  isMultiline?: boolean;
  placeholder?: string;
};

export const Field = ({ icon, isMultiline }: Props) => {
  return (
    <label className={styles.Container}>
      {icon}
      {isMultiline && <TextareaAutosize className={styles.Input} />}
      {!isMultiline && <input className={styles.Input} />}
    </label>
  );
};

export const FormField = forwardRef<
  HTMLInputElement,
  Props & ReturnType<UseFormRegister<any>>
>(({ icon, name, onBlur, onChange, placeholder }, ref) => {
  return (
    <label className={styles.Container}>
      {icon}
      {
        <input
          ref={ref}
          className={styles.Input}
          placeholder={placeholder}
          name={name}
          onBlur={onBlur}
          onChange={onChange}
        />
      }
    </label>
  );
});
