import { useRef, useState } from "react";
import {
  GptMessage,
  MyMessage,
  TextMessageBox,
  TypingLoader,
} from "../../components";
import { prosConsStreamGeneratorUseCase } from "../../../core/use-cases";

interface Message {
  text: string;
  isGpt: boolean;
}
export const ProsConsStreamPage = () => {
  const abortController = useRef(new AbortController());
  const isRunnig = useRef(false);

  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);

  const handlePost = async (text: string) => {
    if(isRunnig.current) {
      abortController.current.abort();
      abortController.current = new AbortController();
    }
    setIsLoading(true);
    isRunnig.current = true;
    setMessages((prev) => [...prev, { text: text, isGpt: false }]);
    const stream = prosConsStreamGeneratorUseCase(text, abortController.current.signal);
    setIsLoading(false);
    setMessages((prev) => [...prev, { text: text, isGpt: true }]);
    for await (const message of stream) {
      setMessages((prev) => {
        const newMessages = [...prev];
        newMessages[newMessages.length - 1].text = message;
        return newMessages;
      });
    }
    isRunnig.current = false;
  };
  return (
    <div className="chat-container">
      <div className="chat-messages">
        <div className="grid grid-cols-12 gap-y-2">
          <GptMessage text="Escribe lo que desea comparar con stream." />
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
