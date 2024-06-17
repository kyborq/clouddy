import { aiApi } from "@/api";
import { useMutation } from "react-query";

const getImageCaption = async (fileBuffer: Buffer, recordId: string) => {
  const formData = new FormData();
  formData.append("file", new Blob([fileBuffer]));

  const { data } = await aiApi.post(`/image-caption/${recordId}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return data; // text caption
};

export const useImageCaption = () => {
  const { data, mutate, isLoading } = useMutation(
    ({ buffer, record }: { buffer: Buffer; record: string }) =>
      getImageCaption(buffer, record),
  );

  return { caption: data, generateCaption: mutate, isGenerating: isLoading };
};
