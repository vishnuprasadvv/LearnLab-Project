import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { X } from "lucide-react"
import groupChatImg from '../../../assets/chat/groupchat.png'
import privateChatAvatarImg from '../../../assets/chat/private-chat-avatar-612x612.jpg'
import { resetSelectedChat } from "@/features/chatSlice";


const ChatHeader = () => {
  const selectedChat = useAppSelector((state) => state.chat.selectedChat) || null;
  const currentUser = useAppSelector((state) => state.auth.user)
  const dispatch = useAppDispatch();


  const isGroupChat = selectedChat?.chatType === 'group';

  const otherUser = !isGroupChat && selectedChat?.participants?.find((p:any) => p._id !== currentUser?._id)
  return (
    <div className="p-2.5 border-b border-base-300">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div className="avatar">
            <div className="size-10 rounded-full overflow-hidden relative">
              <img className="object-contain" src={isGroupChat ? groupChatImg : otherUser && otherUser.profileImageUrl ||  privateChatAvatarImg  } alt='picture' />
            </div>
          </div>

          {/* User info */}
          <div>
            <h3 className="font-medium">{isGroupChat ? selectedChat.chatName || 'NA' : otherUser && `${otherUser.firstName} ${otherUser.lastName}` || 'NA'}</h3>
            <p className="text-sm text-base-content/70">
              {/* {onlineUsers.includes(selectedUser._id) ? "Online" : "Offline"} */}
            </p>
          </div>
        </div>

        {/* Close button */}
        <button onClick={() => dispatch(resetSelectedChat())}>
          <X />
        </button>
      </div>
    </div>
  )
}

export default ChatHeader