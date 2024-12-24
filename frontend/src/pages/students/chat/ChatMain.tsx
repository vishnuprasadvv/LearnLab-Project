
import { useAppSelector } from '@/app/hooks'
import ChatContainer from '@/components/user/chat/ChatContainer'
import ChatSidebar from '@/components/user/chat/ChatSidebar'
import NoChatSelected from '@/components/user/chat/NoChatSelected'
import React, { useState } from 'react'

const ChatMain:React.FC = () => {
    const selectedChat = useAppSelector((state) => state.chat.selectedChat) || null;
    
  return (
    <div className='h-screen bg-base-200 '>
        <div className='flex items-center justify-center pt-20 px-4'>
            <div className='bg-base-100 rounded-lg shadow-xl w-full max-w-6xl h-[calc(100vh-8rem)]'>
                <div className='flex h-full rounded-lg overflow-hidden'>

                    <ChatSidebar  />

                       {!selectedChat ? <NoChatSelected /> : <ChatContainer />}

                </div>

            </div>

        </div>
    </div>
  )
}

export default ChatMain