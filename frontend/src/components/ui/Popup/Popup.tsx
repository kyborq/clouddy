import { AnimatePresence } from "framer-motion";

import { TModalState } from "@/hooks/useModal";

import styles from "./Popup.module.css";

type Props = {
  state: TModalState;
  children?: React.ReactNode;
};

export const Popup = ({ state, children }: Props) => {
  return (
    <AnimatePresence>
      {state.visible && (
        <div className={styles.Overlay}>
          <div className={styles.Popup}>{children}</div>
        </div>
      )}
    </AnimatePresence>
  );
};
