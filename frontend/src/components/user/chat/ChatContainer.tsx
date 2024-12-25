import React, { useEffect, useRef, useState } from "react";
import MessageInput from "./MessageInput";
import ChatHeader from "./ChatHeader";
import { useAppSelector } from "@/app/hooks";
import { getChatMessages } from "@/api/chatApi";
import ChatBubble from "@/components/common/ChatBubble/SenderChatBubble";
import SenderChatBubble from "@/components/common/ChatBubble/SenderChatBubble";
import ReceiverChatBubble from "@/components/common/ChatBubble/ReceiverChatBubble";

export function formatMessageTime(date: any) {
  return new Date(date).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

const ChatContainer = () => {
  const messageEndRef: any = useRef(null);
  const authUser = useAppSelector((state) => state.auth.user);
  const [messages, setMessages] = useState<any[]>([]);
  if (!authUser) return;

  const selectedChat =
    useAppSelector((state) => state.chat.selectedChat) || null;
  const otherUser = selectedChat?.participants?.find(
    (p: any) => p._id !== authUser?._id
  );
  useEffect(() => {
    const getMessages = async () => {
      try {
        if (!selectedChat?._id) {
          return;
        }
        const response = await getChatMessages(selectedChat?._id);
        console.log(response);
        setMessages(response.data);
      } catch (error) {
        console.error("error fetching messages", error);
      }
    };
    getMessages();
  }, [selectedChat]);

  useEffect(() => {
    if (messageEndRef.current && messages) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <div className="flex-1 flex flex-col overflow-auto">
      <ChatHeader />

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="text-lg font-bold text-slate-800 text-center">
            No messages
          </div>
        ) : (
          messages.map((message: any) => (
            <div
              key={message._id}
              className={`  ${
                message.senderId === authUser._id
                  ? "place-items-end"
                  : "place-items-start"
              }`}
              ref={messageEndRef}
            >
              {message.senderId === authUser._id ? (
                <SenderChatBubble
                  time={formatMessageTime(message.sentAt)}
                  message={message.messageText}
                  image={message.image}
                  profileImageUrl={
                    authUser.profileImageUrl ||
                    "https://www.pngall.com/wp-content/uploads/12/Avatar-PNG-Image.png"
                  }
                />
              ) : (
                <ReceiverChatBubble
                  time={formatMessageTime(message.sentAt)}
                  message={message.messageText}
                  image={message.image}
                  profileImageUrl={
                    otherUser?.profileImageUrl ||
                    "https://www.pngall.com/wp-content/uploads/12/Avatar-PNG-Image.png"
                  }
                />
              )}
            </div>
          ))
        )}
      </div>

      <MessageInput />
    </div>
  );
};

export default ChatContainer;
