import { Outlet } from "react-router-dom";

import { HomeIcon, TrashIcon, UserIcon } from "@/assets/icons";
import { Button, Popup, Sidebar, Wrap } from "@/components/ui";
import { useModal } from "@/hooks/useModal";

export const Root = () => {
  const searchPopup = useModal(true);

  return (
    <>
      <Sidebar user={<Button icon={<UserIcon />} />}>
        <Button icon={<HomeIcon />} />
        <Button icon={<TrashIcon />} />
      </Sidebar>
      <Wrap>
        <Outlet />
        <Popup state={searchPopup}></Popup>
      </Wrap>
    </>
  );
};
