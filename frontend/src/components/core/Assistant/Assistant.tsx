import { motion } from "framer-motion";

import { Bubble, Field, FormField } from "@/components/ui";

import styles from "./Assistant.module.css";
import { useForm } from "react-hook-form";
import { useMutation } from "react-query";
import { aiApi } from "@/api";
import { useEffect, useRef, useState } from "react";

type TMessage = {
  role: "assistant" | "me";
  contents: string;
  attachments?: string;
};

export const Assistant = () => {
  const { register, handleSubmit, reset } = useForm<{ query: string }>();
  const { mutate } = useMutation(
    async (data: string) => {
      return await aiApi.get(`/best-match?query=${data}`);
    },
    {
      onSuccess: (data: any) => {
        console.log(data);
        const answer: TMessage = {
          contents: `${data.data.description} - (${
            Math.round(data.data.similarity) || 0
          }%)`,
          role: "assistant",
          attachments: data.data.path,
        };
        setMessages((msgs) => [...msgs, answer]);
        if (chatRef.current) {
          chatRef.current.scrollTo({ top: chatRef.current.scrollHeight });
        }
      },
    }
  );

  const [messages, setMessages] = useState<TMessage[]>([
    { contents: "Что вы хотите найти? Опишите словами:", role: "assistant" },
  ]);

  const handleSearchQuery = (data: { query: string }) => {
    mutate(data.query);
    setMessages((msgs) => [...msgs, { contents: data.query, role: "me" }]);
    reset();
  };

  const chatRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTo({ top: chatRef.current.scrollHeight });
    }
  }, [messages]);

  return (
    <motion.div
      className={styles.Assistant}
      initial={{ scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.2 }}
    >
      <h2 className={styles.Title}>Ассистент</h2>
      <div className={styles.Chat} ref={chatRef}>
        {messages.map((message) => (
          <Bubble
            text={message.contents}
            isSender={message.role === "me"}
            attachment={
              message.attachments &&
              `http://localhost:3000/storage/download/${message.attachments}`
            }
            answers={(message.attachments && ["Скачать"]) || undefined}
            onAction={(id) => {
              if (id === 0 && message.attachments) {
                const link = document.createElement("a");
                link.href = `http://localhost:3000/storage/download/${message.attachments}`;
                link.target = "_blank";
                link.click();
              }
            }}
          />
        ))}
      </div>
      <form className={styles.Form} onSubmit={handleSubmit(handleSearchQuery)}>
        <FormField {...register("query")} />
      </form>
    </motion.div>
  );
};
