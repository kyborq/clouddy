import { useEffect } from "react";
import { Outlet } from "react-router-dom";

import { useUser } from "@/api/hooks/useUser";
import { HomeIcon, TrashIcon, UserIcon } from "@/assets/icons";
import { Button, Sidebar, Wrap } from "@/components/ui";
import { AuthForm } from "@/forms";
import { useModal } from "@/hooks/useModal";

export const Root = () => {
  const { user } = useUser();
  const authModal = useModal(!user);

  useEffect(() => {
    if (user) {
      authModal.close();
    }
  }, [user]);

  return (
    <>
      <Sidebar user={<Button icon={<UserIcon />} />}>
        <Button icon={<HomeIcon />} />
        <Button icon={<TrashIcon />} />
      </Sidebar>
      <Wrap>
        <Outlet />
      </Wrap>

      <AuthForm authModal={authModal} />
    </>
  );
};
