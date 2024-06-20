import { useState } from "react";
import {
  GptMessage,
  MyMessage,
  TextMessageBox,
  TypingLoader,
} from "../../components";
import { prosConsUseCase } from "../../../core/use-cases";

interface Message {
  text: string;
  isGpt: boolean;
}
export const ProsConsPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);

  const handlePost = async (text: string) => {
    setIsLoading(true);
    setMessages((prev) => [...prev, { text: text, isGpt: false }]);
    const { ok, content } = await prosConsUseCase(text);
    if (!ok) {
      setMessages((prev) => [
        ...prev,
        {
          text: "No se pudo realizar la corrección",
          isGpt: true,
        },
      ]);
    } else {
      setMessages((prev) => [
        ...prev,
        {
          text: content,
          isGpt: true,
        },
      ]);
    }
    setIsLoading(false);
  };
  return (
    <div className="chat-container">
      <div className="chat-messages">
        <div className="grid grid-cols-12 gap-y-2">
          <GptMessage text="Escribe lo que desea comparar." />
          {messages.map((message, index) =>
            message.isGpt ? (
              <GptMessage key={index} text={message.text} />
            ) : (
              <MyMessage key={index} text={message.text} />
            )
          )}
          {isLoading && (
            <div className="col-start-1 col-end-12 fade-in">
              <TypingLoader className="fade-in" />
            </div>
          )}
        </div>
      </div>
      <TextMessageBox
        onSendMessage={handlePost}
        placeholder="Escribe aquí lo que deseas..."
        disabledCorrections
      />
    </div>
  );
};
