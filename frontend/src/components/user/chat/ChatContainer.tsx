import React, { useEffect, useRef } from 'react'
import MessageInput from './MessageInput'
import ChatHeader from './ChatHeader'
import { useAppSelector } from '@/app/hooks';

export function formatMessageTime(date :any) {
    return new Date(date).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  }

const ChatContainer = ({selectedUser}:any) => {
    const messageEndRef:any = useRef(null);
    const authUser = useAppSelector((state) => state.auth.user)
    if(!authUser) return ;

    const selectedChat = useAppSelector((state) => state.chat.selectedChat) || null;
  

    // useEffect(() => {
    //     getMessages(selectedUser._id);
    
    //     subscribeToMessages();
    
    //     return () => unsubscribeFromMessages();
    //   }, [selectedUser._id, getMessages, subscribeToMessages, unsubscribeFromMessages]);

    // useEffect(() => {
    //     if (messageEndRef.current && messages) {
    //       messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    //     }
    //   }, [messages]);

    const messages:any = [11,2,3,5]
  return (
    <div className="flex-1 flex flex-col overflow-auto">
      <ChatHeader />

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message:any) => (
          <div
            key={message._id}
            className={`chat ${message.senderId === authUser._id ? "chat-end" : "chat-start"}`}
            ref={messageEndRef}
          >
            <div className=" chat-image avatar">
              <div className="size-10 rounded-full border">
                <img
                  src={
                    message.senderId === authUser._id
                      ? authUser.profileImageUrl || "https://www.pngall.com/wp-content/uploads/12/Avatar-PNG-Image.png"
                      : selectedUser || "https://www.pngall.com/wp-content/uploads/12/Avatar-PNG-Image.png"
                  }
                  alt="profile pic"
                />
              </div>
            </div>
            <div className="chat-header mb-1">
              <time className="text-xs opacity-50 ml-1">
                {formatMessageTime(message.createdAt)}
              </time>
            </div>
            <div className="chat-bubble flex flex-col">
              {message.image && (
                <img
                  src={message.image}
                  alt="Attachment"
                  className="sm:max-w-[200px] rounded-md mb-2"
                />
              )}
              {message.text && <p>{message.text}</p>}
            </div>
          </div>
        ))}
      </div>

      <MessageInput />
    </div>
  )
}

export default ChatContainer