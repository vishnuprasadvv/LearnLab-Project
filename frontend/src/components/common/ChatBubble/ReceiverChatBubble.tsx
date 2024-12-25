import React from "react";

interface ChatBubbleProps {
    profileImageUrl : string;
    time:string;
    message:string;
    image?: string;
}

const ReceiverChatBubble:React.FC<ChatBubbleProps> = ({profileImageUrl, time,message , image}) => {
  return (
    <div className="flex flex-row items-start gap-2">
      <img
        className="w-8 h-8 rounded-full"
        src={profileImageUrl}
        alt="Jese image"
      />
      <div className="flex flex-col w-full max-w-[320px] leading-1.5 p-2 border-gray-200 bg-gray-100 rounded-e-xl rounded-es-xl dark:bg-gray-700">
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
        <span className="text-xs font-normal text-gray-500 dark:text-gray-400">
            {time || 'NA'}
          </span>
        </div>
          
      </div>
    </div>
  );
};

export default ReceiverChatBubble;
