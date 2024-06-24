import { api } from "@/api";
import { useMutation } from "react-query";
import { useImageCaption } from "./useCaption";
import { TStorageItem } from "@/api/models/storageModel";
import { useEffect } from "react";

const getFile = async (fileName: string) => {
  const response = await api.get(`/storage/download/${fileName}`, {
    responseType: "blob",
  });
  const objectUrl = URL.createObjectURL(response.data);
  return { blob: response.data, url: objectUrl };
};

export const usePreview = () => {
  // const { caption, generateCaption } = useImageCaption();

  const { data, mutate } = useMutation(["file"], getFile, {
    // onSuccess: (data) => {
    // generateCaption(data.blob);
    // },
  });
  return { previewFile: data, getFilePreview: mutate };
};

export const useGetFile = () => {
  const { caption, generateCaption, isGenerating } = useImageCaption();
  const { getFilePreview, previewFile } = usePreview();

  const { data: file, mutate: getFile } = useMutation(
    async (data: string) => {
      const { data: file } = await api.get<TStorageItem>(`/storage/${data}`);
      return file;
    },
    {
      onSuccess: (data) => {
        getFilePreview(data.fileName);
      },
    }
  );

  useEffect(() => {
    if (previewFile && file && !file.description) {
      generateCaption({ buffer: previewFile.blob, record: file.id });
    }
  }, [previewFile, file, generateCaption]);

  return { file, previewFile, caption, getFile, isGenerating };
};
