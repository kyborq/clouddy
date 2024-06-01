import { FileIcon, ImageIcon, VideoIcon } from "@/assets/icons";

import styles from "./File.module.css";

export const File = () => {
  return (
    <div className={styles.File}>
      <div className={styles.Icon}>
        <FileIcon width={20} />
      </div>
      <span className={styles.Title}>Moments.pdf</span>
    </div>
  );
};
