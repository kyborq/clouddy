import { useStorage } from "@/api/hooks/useStorage";
import { useUpload } from "@/api/hooks/useUpload";
import { TStorageItem } from "@/api/models/storageModel";
import { UploadIcon } from "@/assets/icons";
import { File, Loader } from "@/components/core";
import { Button, Field, Header, Modal } from "@/components/ui";
import { useModal } from "@/hooks/useModal";
import { useEffect, useState } from "react";
import { useGetFile } from "./hooks/useFile";

export const HomePage = () => {
  const { ref, handleSubmit, handleUpload } = useUpload();
  const files = useStorage();
  const [selectedFile, setSelectedFile] = useState<TStorageItem | null>(null);

  const previewModal = useModal();
  const { caption, previewFile, getFile, isGenerating } = useGetFile();

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
            {!isGenerating ? (
              <>{selectedFile.description || caption}</>
            ) : (
              <Loader />
            )}
          </p>
        </Modal>
      )}
    </div>
  );
};
