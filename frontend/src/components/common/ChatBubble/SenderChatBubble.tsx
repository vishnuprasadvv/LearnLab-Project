import { Check, CheckCheck } from "lucide-react";
import React from "react";

interface ChatBubbleProps {
  profileImageUrl: string;
  time: string;
  message: string;
  image?:string;
  isRead?: boolean;
}

const SenderChatBubble: React.FC<ChatBubbleProps> = ({
  profileImageUrl,
  time,
  message,
  image,
  isRead
}) => {
  return (
    <div className="flex flex-row-reverse items-start gap-2">
      <img
        className="w-8 h-8 rounded-full"
        src={profileImageUrl}
        alt="Jese image"
      />
      <div className="flex flex-col w-full max-w-[320px] leading-1.5 p-2 border-blue-200 bg-blue-100 rounded-s-xl rounded-ee-xl dark:bg-blue-500 dark:text-white">
        <div className="flex flex-col">
          { image && (
            <img
              src={
               image || ''
              }
              alt="Attachment"
              className="sm:max-w-[200px] rounded-md mb-2"
            />
          )
          }
          {message && (
            <p className="text-sm font-normal py-1 text-gray-900 dark:text-white">
              {message || ""}
            </p>
          )}
        </div>

        <div className="flex gap-1 place-self-end">
          <span className="text-xs font-normal text-gray-500 dark:text-gray-300">
            {time || "NA"}
          </span>

          <span className="text-xs font-normal text-gray-500 dark:text-gray-400">
          {isRead ? (<CheckCheck className="text-blue-400 dark:text-blue-700" size={16}/>) : (<Check size={16} className="dark:text-gray-200"/> )}
          </span>
        </div>
      </div>
    </div>
  );
};

export default SenderChatBubble;
