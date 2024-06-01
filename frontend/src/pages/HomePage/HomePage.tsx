import { UploadIcon } from "@/assets/icons";
import { File } from "@/components/core";
import { Button, Header } from "@/components/ui";

export const HomePage = () => {
  return (
    <div
      style={{
        maxWidth: 1104,
        width: "100%",
      }}
    >
      <Header
        title="Главная"
        action={<Button icon={<UploadIcon />} label="Загрузить" />}
      />
      <div style={{ display: "flex", flexWrap: "wrap", gap: "26px" }}>
        <File />
      </div>
    </div>
  );
};
