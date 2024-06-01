import { AnimatePresence, motion } from "framer-motion";
import { useRef } from "react";
import { useOnClickOutside, useScrollLock } from "usehooks-ts";

import { CloseIcon } from "@/assets/icons";
import { TModalState } from "@/hooks/useModal";

import { Button } from "../";
import styles from "./Modal.module.css";

type Props = {
  state: TModalState;
  title: string;
  disableClose?: boolean;
  children?: React.ReactNode;
  onClose?: () => void;
};

export const Modal = ({
  state,
  title,
  children,
  disableClose,
  onClose,
}: Props) => {
  const modalRef = useRef<HTMLDivElement>(null);

  const { unlock } = useScrollLock();

  const handleClose = () => {
    if (!disableClose) {
      onClose && onClose();
      state.close();
      unlock();
    }
  };

  useOnClickOutside(modalRef, handleClose);

  return (
    <AnimatePresence>
      {state.visible && (
        <motion.div
          className={styles.Overlay}
          initial={{
            backgroundColor: "rgba(0, 0, 0, 0.0)",
            backdropFilter: "blur(0)",
          }}
          animate={{
            backgroundColor: "rgba(0, 0, 0, 0.15)",
            backdropFilter: "blur(4px)",
          }}
          exit={{
            backgroundColor: "rgba(0, 0, 0, 0.0)",
            backdropFilter: "blur(0)",
          }}
        >
          <motion.div
            ref={modalRef}
            className={styles.Modal}
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
          >
            <div className={styles.Header}>
              <span className={styles.Title}>{title}</span>
              {!disableClose && (
                <Button icon={<CloseIcon />} onClick={handleClose} />
              )}
            </div>
            <div className={styles.Content}>{children}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
