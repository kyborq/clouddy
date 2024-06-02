import { ChangeEvent, useRef } from "react";

import { useStorage } from "@/api/hooks/useStorage";
import { UploadIcon } from "@/assets/icons";
import { File } from "@/components/core";
import { Button, Header } from "@/components/ui";

export const HomePage = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmitFile = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      // const currentFile = files[0];
      // uploadFile(currentFile);
    }
  };

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const files = useStorage();

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
        {files.map((file) => (
          <File key={file.id} file={file} />
        ))}
      </div>
    </div>
  );
};
