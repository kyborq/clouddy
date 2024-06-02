import { ChangeEvent, useRef } from "react";
import { useMutation, useQueryClient } from "react-query";

import { uploadFile } from "../services/storageService";

export const useUpload = () => {
  const queryClient = useQueryClient();
  const ref = useRef<HTMLInputElement>(null);

  const { mutate } = useMutation(uploadFile, {
    onMutate: (file) => {
      console.log(`Start upload ${file.name}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["files"]);
    },
  });

  const handleSubmit = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const currentFile = files[0];
      mutate(currentFile);
    }
  };

  const handleUpload = () => {
    if (ref.current) {
      ref.current.click();
    }
  };

  return {
    handleSubmit,
    handleUpload,
    ref,
  };
};
