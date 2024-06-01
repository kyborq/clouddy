import { UploadedFile } from "@/api/models/file-model";
import { FileIcon, ImageIcon, VideoIcon } from "@/assets/icons";

import styles from "./File.module.css";

type Props = {
  file: UploadedFile;
};

export const File = ({ file }: Props) => {
  return (
    <div className={styles.File}>
      <div className={styles.Info}>
        <div className={styles.Icon}>
          {file.alias.match("jpg|png|jpeg|gif") && <ImageIcon width={20} />}
          {file.alias.match("avi|mp4") && <VideoIcon width={20} />}
          {file.alias.match("pdf|doc|docx|xls|xlsx") && <FileIcon width={20} />}
        </div>
        <span className={styles.Title}>{file.alias}</span>
      </div>
      <span className={styles.Date}>
        {file.uploadDate && file.uploadDate.toString()}
      </span>
    </div>
  );
};
