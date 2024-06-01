import { Outlet } from "react-router-dom";

import { HomeIcon, TrashIcon, UserIcon } from "@/assets/icons";
import { Button, Sidebar, Wrap } from "@/components/ui";

export const Root = () => {
  return (
    <>
      <Sidebar user={<Button icon={<UserIcon />} />}>
        <Button icon={<HomeIcon />} />
        <Button icon={<TrashIcon />} />
      </Sidebar>
      <Wrap>
        <Outlet />
      </Wrap>
    </>
  );
};
