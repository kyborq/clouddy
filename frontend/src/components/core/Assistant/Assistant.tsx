import { motion } from "framer-motion";

import { Bubble, Field } from "@/components/ui";

import styles from "./Assistant.module.css";

export const Assistant = () => {
  return (
    <motion.div
      className={styles.Assistant}
      initial={{ scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.2 }}
    >
      <h2 className={styles.Title}>Ассистент</h2>
      <div className={styles.Chat}>
        <Bubble
          answers={[
            "Помоги найти файл",
            "Советы по структуризации",
            "Как содержать хранилище в чистоте",
            "Что изображено на фото / видео",
            "Краткое содержание документа",
          ]}
          text="Привет, я Ассистент! Умею находить файлы по описанию и держать хранилище в чистоте и порядке 🚙"
        />
      </div>
      <div className={styles.Form}>
        <Field />
      </div>
    </motion.div>
  );
};
