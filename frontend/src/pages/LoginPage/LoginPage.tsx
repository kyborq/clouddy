import { useForm } from "react-hook-form";

import LogoIcon from "@/assets/logo.svg?react";
import { Button, FormField, Group, Wrap } from "@/components/ui";

export const LoginPage = () => {
  const { register } = useForm();

  return (
    <Wrap centered gapBetween={32}>
      <LogoIcon />
      <Group>
        <FormField
          placeholder="Введите электронную почту"
          {...register("password")}
        />
      </Group>
      <Button label="Запросить" />
    </Wrap>
  );
};
