import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

import AppLogoLight from "@/assets/logo-light.svg?react";
import AppLogo from "@/assets/logo.svg?react";
import { Assistant } from "@/components/core/Assistant";
import { useModal } from "@/hooks/useModal";
import { classes } from "@/utils/classes";

import styles from "./Sidebar.module.css";

type Props = {
  user?: React.ReactNode;
  children?: React.ReactNode;
};

export const Sidebar = ({ children, user }: Props) => {
  const sidebarExpand = useModal();
  const [theme, setTheme] = useState<string | null>(null);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    mediaQuery.addEventListener("change", (e) => {
      setTheme(e.matches ? "dark" : "light");
    });

    setTheme(mediaQuery.matches ? "dark" : "light");
  }, []);

  const CurrentAppLogo = theme === "dark" ? AppLogoLight : AppLogo;

  return (
    <motion.div
      animate={{ width: sidebarExpand.visible ? 460 : 112 }}
      transition={{
        duration: 0.3,
        ease: "easeInOut",
      }}
      className={classes(
        styles.Sidebar,
        sidebarExpand.visible && styles.Expanded
      )}
    >
      <div className={styles.Navigation}>
        <CurrentAppLogo
          className={styles.Logo}
          onClick={sidebarExpand.toggle}
        />
        <div className={styles.Contents}>{children}</div>
        {user}
      </div>
      <AnimatePresence>
        {sidebarExpand.visible && <Assistant />}
      </AnimatePresence>
    </motion.div>
  );
};
