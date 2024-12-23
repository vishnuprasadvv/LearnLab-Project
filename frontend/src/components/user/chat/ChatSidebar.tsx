import React, { useEffect, useState } from "react";
import ChatSidebarSkeleton from "./ChatSidebarSkeleton";
import { PlusCircle, Users } from "lucide-react";
import { createChatApi, getChatUsersApi, getUserChatsApi } from "@/api/chatApi";
import { User } from "@/types/userTypes";
import { IChat } from "@/types/chat";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { setSelectedChat } from "@/features/chatSlice";

const ChatSidebar:React.FC = () => {
  const onlineUsers = [];
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [chats, setChats] = useState<IChat[]> ([])
    const [users, setUsers] = useState<User[] | []>([])
    const currentUser  = useAppSelector((state) => state.auth.user)

    const [showPopup, setShowPopup] = useState<boolean>(false); // Popup state
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const dispatch = useAppDispatch()
    const selectedChat = useAppSelector((state) => state.chat.selectedChat)

    useEffect(() => {
        const fetchUsers = async() => {
            try {
                const response = await getChatUsersApi()
                console.log(response)
                setUsers(response.data)
            } catch (error) {
                console.error('fetching user error', error)
            }
        }
        fetchUsers()
    },[])

    useEffect(()=> {
        const fetchChats = async() => {
            try {
                const response = await getUserChatsApi()
                console.log(response.data)
                setChats(response.data)
            } catch (error) {
                console.error('fetching user error', error)
            }
        }
        fetchChats()
    },[])
       

    const handleCreateChat = async () => {
        if (!selectedUser) return;
        if(!currentUser) return
        try {
          const response = await createChatApi({participants: [currentUser?._id, selectedUser._id] , chatType:'private' });
          setChats((prevChats) => [response.data, ...prevChats]); // Add new chat to chat list
          setShowPopup(false); // Close the popup
          setSelectedUser(null); // Reset selected user
        } catch (error) {
          console.error("Error creating chat", error);
        }
      };

      const handleSelectChat = (chat:IChat) => {
        dispatch(setSelectedChat(chat))
      }

  if(isLoading) return <ChatSidebarSkeleton /> 

  return (
    <aside className="h-full w-24  lg:w-72 border-r border-base-300 flex flex-col transition-all duration-200">
        <div className="border-b border-base-300 w-full overflow-x-auto items-center">
            <div className="flex justify-between px-2">
          
            <div className="flex items-center gap-2">
                <Users className = 'size-6' />
                <span className="font-medium hidden lg:block">Contacts</span>
            </div>
            <div className="flex items-center gap-2 cursor-pointer hover:scale-105 hover:text-blue-500 duration-300 transition-all "
            onClick={() => setShowPopup(true)}>
                <PlusCircle className = 'size-6' />
                <span className="font-medium hidden lg:block">New chat</span>
            </div>
            </div>

            <div className="overflow-y-auto w-full py-3">
                {
                    chats.map((chat) => {
                        const oppositeUser:any = chat.participants.find((p:any) => p._id !== currentUser?._id)
                        return(
                        <button 
                        key={chat._id}
                        onClick={() => handleSelectChat(chat)}
                        className={`w-full lg:border border-b-slate-50 hover:bg-slate-100 p-3 flex items-center gap-3 hover:bg-base-300 transition-colors
                        ${selectedChat?._id === chat._id ? 'bg-slate-300 hover:bg-slate-300' : ''}`}>


                            <div className="relative mx-auto lg:mx-0">
                                <img src={oppositeUser.profileImageUrl || 'https://www.pngall.com/wp-content/uploads/12/Avatar-PNG-Image.png'} alt="profile pic" 
                                className="size-10 object-cover rounded-full"/>
                                {/* {onlineUsers.includes(user._id) && ( */}
                                    <span className="absolute bottom-0 right-0 size-3 bg-green-400
                                    rounded-full"></span>
                                {/* )} */}
                                
                            </div>

                            <div className="hidden lg:block text-left min-w-0">
                                <div className="font-medium truncate">
                                    {oppositeUser.firstName +' ' + oppositeUser.lastName}
                                </div>
                                <div className="text-sm text-zinc-400">
                                    'online'
                                </div>
                            </div>
                        </button>
                    )}
                )
                }

            </div>
        </div>

        {/* Popup for creating a new chat */}
      {showPopup && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h3 className="text-lg font-medium mb-4">Select a User</h3>
            <div className="overflow-y-auto h-64">
              {users
                .filter((user) => user._id !== currentUser?._id) // Exclude current user
                .map((user) => (
                  <button
                    key={user._id}
                    className={`w-full flex items-center gap-3 p-2 rounded-md ${
                      selectedUser?._id === user._id ? "bg-blue-100" : "hover:bg-gray-100"
                    }`}
                    onClick={() => setSelectedUser(user)}
                  >
                    <img
                      src={user.profileImageUrl || "https://www.pngall.com/wp-content/uploads/12/Avatar-PNG-Image.png"}
                      alt={user.firstName}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <span className="text-sm font-medium">{user.firstName + " " + user.lastName}</span>
                  </button>
                ))}
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <button className="btn btn-secondary" onClick={() => setShowPopup(false)}>
                Cancel
              </button>
              <button
                className="btn btn-primary"
                onClick={handleCreateChat}
                disabled={!selectedUser} // Disable button if no user is selected
              >
                Create Chat
              </button>
            </div>
          </div>
        </div>
      )}
    </aside>
  )
};

export default ChatSidebar;
