import { useStorage } from "@/api/hooks/useStorage";
import { useUpload } from "@/api/hooks/useUpload";
import { UploadIcon } from "@/assets/icons";
import { File } from "@/components/core";
import { Button, Header } from "@/components/ui";

export const HomePage = () => {
  const { ref, handleSubmit, handleUpload } = useUpload();
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
          <File key={file.id} file={file} />
        ))}
      </div>
    </div>
  );
};
