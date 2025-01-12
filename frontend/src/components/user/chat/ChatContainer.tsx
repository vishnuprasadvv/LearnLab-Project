import React, { useEffect, useRef, useState } from "react";
import MessageInput from "./MessageInput";
import ChatHeader from "./ChatHeader";
import { useAppSelector } from "@/app/hooks";
import { getChatMessages, markAsReadApi } from "@/api/chatApi";
import SenderChatBubble from "@/components/common/ChatBubble/SenderChatBubble";
import ReceiverChatBubble from "@/components/common/ChatBubble/ReceiverChatBubble";
import socket from "@/utils/socket";

export function formatMessageTime(date: any) {
  return new Date(date).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

const ChatContainer:React.FC = () => {
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
    const markMessagesAsRead = async () => {
      if (!selectedChat?._id || !authUser) return;
      // Check if there are any unread messages
      const hasUnreadMessages = messages.some(
        (message) => !message.isRead && message.senderId !== authUser._id
      );
  
      if (hasUnreadMessages) {
        try {
          await markAsReadApi({ chatId: selectedChat._id, userId: authUser._id });
          // Update the message state locally to reflect the read status
          setMessages((prevMessages) =>
            prevMessages.map((msg) =>
              msg.senderId !== authUser._id ? { ...msg, isRead: true } : msg
            )
          );
        } catch (error) {
          console.error("Error marking messages as read:", error);
        }
      }
    };
  
    markMessagesAsRead();
  }, [messages, selectedChat, authUser]);

  


  useEffect(() => {
    socket.on('newMessage', (message) => {
      if(selectedChat?._id === message.chatId){
        setMessages((prev) => 
        {
          const messageIds = new Set(prev.map((m) => m._id));
    
          if(messageIds.has(message._id)){
            return prev
          }
          return [...prev, message]
        }
      )
      }
    })

    socket.on('messagesRead', (data) => {
      if (selectedChat?._id === data.chatId) {
        // Update the isRead status of all messages in the current chat
        setMessages((prevMessages) =>
          prevMessages.map((msg) =>
            msg.senderId === authUser._id && !msg.isRead ? { ...msg, isRead: true } : msg
          )
        );
      }
    });

    if(selectedChat?._id) {
      socket.emit('joinChat', selectedChat._id)
    }
    return () => {
     // socket.off('newMessage')
      //socket.off('messagesRead')
    }
  }, [selectedChat, ])

  useEffect(() => {
    const getMessages = async () => {
      try {
        if (!selectedChat?._id) {
          return;
        }
        const response = await getChatMessages(selectedChat?._id);
        setMessages(response.data);
      } catch (error) {
        console.error("error fetching messages", error);
      }
    };
    getMessages();
  }, [selectedChat]);

  useEffect(() => {
    if (messageEndRef.current && messages) {
      messageEndRef.current.scrollTo({
        top: messageEndRef.current.scrollHeight,
        behavior: "smooth", // Adds smooth animation
      });
    }
  }, [messages]);
  return (
    <div className="flex-1 flex flex-col overflow-auto">
      <ChatHeader />

      <div className="flex-1 overflow-y-auto p-4 space-y-4" 
      ref={messageEndRef}
      >
        {messages.length === 0 ? (
          <div className="text-lg font-bold text-slate-800 dark:text-gray-200 text-center">
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
              
            >
              {message.senderId === authUser._id ? (
                <SenderChatBubble
                  time={formatMessageTime(message.sentAt)}
                  message={message.messageText}
                  image={message.image}
                  isRead={message.isRead}
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
