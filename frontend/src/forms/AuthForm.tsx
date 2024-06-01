import { AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";

import { useLogin } from "@/api/hooks/useLogin";
import { Credentials } from "@/api/models/auth-model";
import { LockIcon, UserIcon } from "@/assets/icons";
import { Error } from "@/components/core";
import { Button, FormField, Group, Modal } from "@/components/ui";
import { TModalState } from "@/hooks/useModal";

type Props = {
  authModal: TModalState;
};

export const AuthForm = ({ authModal }: Props) => {
  const { register, handleSubmit } = useForm<Credentials>();
  const { loginUser, isError, error } = useLogin();

  const handleLogin = (data: Credentials) => {
    console.log(data);
    loginUser(data);
  };

  return (
    <Modal state={authModal} title="Авторизация" disableClose>
      <Group>
        <FormField
          icon={<UserIcon />}
          placeholder="Логин"
          {...register("login")}
        />
        <FormField
          icon={<LockIcon />}
          placeholder="Пароль"
          {...register("password")}
        />
      </Group>
      <AnimatePresence>
        {isError && <Error error={(error as any).response?.data.message} />}
      </AnimatePresence>
      <Button label="Войти" onClick={handleSubmit(handleLogin)} />
    </Modal>
  );
};
