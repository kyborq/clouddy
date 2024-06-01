import { ChangeEvent, useRef } from "react";

import { useFiles } from "@/api/hooks/useFiles";
import { useUpload } from "@/api/hooks/useUpload";
import { UploadIcon } from "@/assets/icons";
import { File } from "@/components/core";
import { Button, Header } from "@/components/ui";

export const HomePage = () => {
  const { uploadFile } = useUpload();
  const { files } = useFiles();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmitFile = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const currentFile = files[0];
      uploadFile(currentFile);
    }
  };

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div
      style={{
        maxWidth: 1104,
        width: "100%",
      }}
    >
      <Header
        title="Главная"
        action={
          <Button
            icon={<UploadIcon />}
            label="Загрузить"
            onClick={handleButtonClick}
          />
        }
      />
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: "none" }}
        onChange={handleSubmitFile}
      />
      <div style={{ display: "flex", flexWrap: "wrap", gap: "26px" }}>
        {files.map((file, index) => (
          <File key={`${file.alias}-${index}`} file={file} />
        ))}
      </div>
    </div>
  );
};
