import { useMutation } from "react-query";

import { UploadedFile } from "../models/file-model";
import { downloadFile, uploadFile } from "../services/upload-service";

export const useUpload = () => {
  const { mutate: upload } = useMutation({
    mutationFn: (file: File) => uploadFile(file),
  });

  const { mutate: download } = useMutation({
    mutationFn: (file: UploadedFile) => downloadFile(file),
  });

  return {
    uploadFile: upload,
    downloadFile: download,
  };
};
