import { useStorage } from "@/api/hooks/useStorage";
import { useUpload } from "@/api/hooks/useUpload";
import { TStorageItem } from "@/api/models/storageModel";
import { UploadIcon } from "@/assets/icons";
import { File, Loader } from "@/components/core";
import { Button, Field, Header, Modal } from "@/components/ui";
import { useModal } from "@/hooks/useModal";
import { useEffect, useState } from "react";
import { useGetFile } from "./hooks/useFile";
import { useMutation } from "react-query";
import { aiApi } from "@/api";

export const HomePage = () => {
  const { ref, handleSubmit, handleUpload } = useUpload();
  const files = useStorage();
  const [selectedFile, setSelectedFile] = useState<TStorageItem | null>(null);

  const previewModal = useModal();
  const { caption, previewFile, getFile, isGenerating } = useGetFile();

  const updateDescription = async ({
    id,
    description,
  }: {
    id: string;
    description: string;
  }) => {
    await aiApi.put(
      `/update-description/${id}`,
      {
        new_description: description,
      },
      {}
    );
  };

  const [v, setV] = useState("");

  useEffect(() => {
    if (caption) {
      setV(caption);
    }
  }, [caption]);

  const updateDescriptionMutation = useMutation(updateDescription, {
    onSuccess: () => {
      // Invalidate and refetch
      previewModal.close();
    },
  });

  useEffect(() => {
    if (selectedFile) {
      getFile(selectedFile.fileName);
    }
  }, [selectedFile, getFile]);

  return (
    <div
      style={{
        maxWidth: 1024,
        width: "100%",
      }}
    >
      <Header
        title="Файлы"
        action={
          <Button
            icon={<UploadIcon />}
            label="Загрузить"
            onClick={handleUpload}
          />
        }
      />
      <input
        type="file"
        ref={ref}
        style={{ display: "none" }}
        onChange={handleSubmit}
      />
      <div style={{ display: "flex", flexWrap: "wrap", gap: "26px" }}>
        {files.map((file) => (
          <File
            key={file.id}
            file={file}
            onSelect={() => {
              previewModal.open();
              setSelectedFile(file);
              setV(file.description || "");
            }}
          />
        ))}
      </div>

      {selectedFile && (
        <Modal
          state={previewModal}
          title={`Предпросмотр ${selectedFile.fileName}`}
        >
          {previewFile && (
            <img
              style={{ borderRadius: 18, marginBottom: 24 }}
              src={previewFile.url}
            />
          )}
          <p>
            {isGenerating ? (
              <Loader />
            ) : (
              <>
                <Field
                  placeholder="Описание"
                  value={v}
                  onChange={(value) => setV(value)}
                />
                <Button
                  label="Сохранить"
                  onClick={() =>
                    selectedFile.description &&
                    updateDescriptionMutation.mutate({
                      id: selectedFile.id,
                      description: selectedFile.description || caption,
                    })
                  }
                />
              </>
            )}
            {/* {!isGenerating ? (
              <>{selectedFile.description || caption}</>
            ) : (
              <Loader />
            )} */}
          </p>
        </Modal>
      )}
    </div>
  );
};
