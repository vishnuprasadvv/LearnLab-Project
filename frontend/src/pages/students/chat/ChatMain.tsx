
import { useAppDispatch, useAppSelector } from '@/app/hooks'
import ChatContainer from '@/components/user/chat/ChatContainer'
import ChatSidebar from '@/components/user/chat/ChatSidebar'
import NoChatSelected from '@/components/user/chat/NoChatSelected'
import { resetSelectedChat } from '@/features/chatSlice'
import { useSocket } from '@/hooks/use-socket'
import React, { useEffect, } from 'react'

const ChatMain:React.FC = () => {
  const currentUser = useAppSelector((state) => state.auth.user)
  const dispatch = useAppDispatch()
  useSocket(currentUser)
  const selectedChat = useAppSelector((state) => state.chat.selectedChat) || null;
      useEffect(() => {
        // Cleanup action to reset selected chat when component unmounts
        
        return () => {
          dispatch(resetSelectedChat());
        };
      }, [dispatch]);
    
  return (
    <div className='h-screen bg-slate-100 dark:bg-slate-800'>
      <h1 className='text-2xl font-bold text-center pt-2'>My Chats</h1>
        <div className='flex items-center justify-center pt-5 px-4'>
            <div className='bg-base-100 rounded-lg shadow-xl w-full max-w-6xl h-[calc(100vh-8rem)]'>
                <div className='bg-white dark:bg-slate-900 flex h-full rounded-lg overflow-hidden'>

                    <ChatSidebar  />

                       {!selectedChat ? <NoChatSelected /> : <ChatContainer />}

                </div>

            </div>

        </div>
    </div>
  )
}

export default ChatMain