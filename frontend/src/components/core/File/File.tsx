import { TStorageItem } from "@/api/models/storageModel";
import { FileIcon } from "@/assets/icons";
import { formatFileSize } from "@/utils/files";

import styles from "./File.module.css";

type Props = {
  file: TStorageItem;
};

export const File = ({ file }: Props) => {
  return (
    <div className={styles.File}>
      <div className={styles.Info}>
        <div className={styles.Icon}>
          <FileIcon width={20} />
        </div>
        <span className={styles.Title}>{file.fileName}</span>
      </div>
      <span className={styles.Date}>{formatFileSize(file.size)}</span>
    </div>
  );
};
