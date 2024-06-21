import { useState } from "react";
import {
  GptMessage,
  GptMessageAudio,
  MyMessage,
  TextMessageBoxSelect,
  TypingLoader,
} from "../../components";
import { textToAudioUseCase } from "../../../core/use-cases";

interface TextMessage {
  text: string;
  isGpt: boolean;
  type: 'text';
}

interface AudioMessage {
  text: string;
  isGpt: boolean;
  audio: string;
  type: 'audio';
}

type Message = TextMessage | AudioMessage;

const voices = [
  { id: "nova", text: "Nova" },
  { id: "alloy", text: "Alloy" },
  { id: "echo", text: "Echo" },
  { id: "fable", text: "Fable" },
  { id: "onyx", text: "Onyx" },
  { id: "shimmer", text: "Shimmer" },
]

export const TextToAudioPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);

  const handlePost = async (text: string, selectedVoice: string) => {
    setIsLoading(true);
    setMessages((prev) => [...prev, { text: text, isGpt: false, type: 'text'}]);
    const { ok, message, audioUrl } = await textToAudioUseCase(text, selectedVoice);
    setIsLoading(false);
    if (!ok) {
      setMessages((prev) => [
        ...prev,
        {
          text: "No se pudo realizar el audio",
          isGpt: true,
          type: 'text'
        },
      ]);
    } else {
      setMessages((prev) => [
        ...prev,
        {
          text: `${selectedVoice} - ${message}`,
          isGpt: true,
          audio: audioUrl!,
          type: 'audio',
        },
      ]);
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-messages">
        <div className="grid grid-cols-12 gap-y-2">
          <GptMessage text="¿Qué desea escuchar?" />
          {messages.map((message, index) =>
            message.isGpt ? (
              message.type === 'audio' ? (
                <GptMessageAudio key={index} text={message.text} audio={message.audio} />
              ) : (
                <GptMessage key={index} text={message.text} />
              )
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
      <TextMessageBoxSelect
        onSendMessage={handlePost}
        placeholder="Escribe aquí lo que deseas..."
        options={voices}
      />
    </div>
  );
};
