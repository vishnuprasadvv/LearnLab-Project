import { sendMessageApi } from '@/api/chatApi';
import { useAppSelector } from '@/app/hooks';
import { Input } from '@/components/ui/input';
import socket from '@/utils/socket';
import { Image, Send, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import toast from 'react-hot-toast';

const MessageInput = () => {
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | ArrayBuffer | null>(null);
    const [text, setText] = useState<string>('')
    const fileInputRef : any = useRef(null)
    const selectedChat = useAppSelector((state) => state.chat.selectedChat)
    const currentUser = useAppSelector((state)=> state.auth.user)
    const [isLoading, setIsLoading] = useState(false)


    const handleSendMessage = async(e:React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true)
        if(!text.trim() && !imageFile) {
          toast.error('Message cannot be empty')
          return;
        }
        if(!selectedChat?._id || !currentUser?._id){
          return;
        }
        try {
          const response = await sendMessageApi({senderId: currentUser?._id, messageText: text, chatId: selectedChat?._id, image: imageFile})
          console.log(response)

          //emit the message to the server so it can be broadcasted to other user
          socket.emit('sendMessage',{
            senderId: currentUser._id,
            messageText: text,
            chatId: selectedChat._id,
            image:response.data.image || null,
            sentAt: response.data.sentAt,
            isRead: response.data.isRead,
            _id: response.data._id,
            replyToMessageId: response.data.replyToMessageId,
          })
          setText('')
          setImagePreview(null)
          setImageFile(null);
        } catch (error:any) {
          toast.error(error.message || 'Error sending message')
          console.error('error sending message', error)
        }finally{
          setIsLoading(false)
        }
    }

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      if (event.target.files && event.target.files[0]) {
        const file = event.target.files[0]
        setImageFile(event.target.files[0]);
        // Generate the image preview
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreview(reader.result);
        };
        reader.readAsDataURL(file); // Convert the file to a base64 URL
      }
      }
    
      const removeImage = () => {
        setImagePreview(null);
        setImageFile(null)
        if (fileInputRef.current) fileInputRef.current.value = "";
      };

  return (
    <div className="p-4 w-full">
      {imagePreview && (
        <div className="mb-3 flex items-center gap-2">
          <div className="relative">
            <img
              src={imagePreview.toString()}
              alt="Preview"
              className="w-20 h-20 object-cover rounded-lg border border-zinc-700"
            />
            <button
               onClick={removeImage}
              className="absolute -top-4 -right-4 w-5 h-5 rounded-full bg-base-300
              flex items-center justify-center"
              type="button"
            >
              <X className="size-4 hover:text-red-500 hover:scale-125 duration-300" />
            </button>
          </div>
        </div>
      )}

      <form onSubmit={handleSendMessage} className="flex items-center gap-2">
        <div className="flex-1 flex gap-2 items-center">
          <Input
            type="text"
            className="w-full input input-bordered rounded-lg input-sm sm:input-md"
            placeholder="Type a message..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={fileInputRef}
            onChange={handleImageChange}
          />

          <button
            type="button"
            className={`hidden sm:flex btn btn-circle
                     ${imagePreview ? "text-emerald-500" : "text-zinc-400"}`}
            onClick={() => fileInputRef.current?.click()}
          >
            <Image size={25} />
          </button>
        </div>
        <button 
          type="submit"
          className="btn btn-sm btn-circle"
          disabled={!text.trim() && !imageFile || isLoading}
        >
          <Send size={22} className={`${isLoading || !text.trim() && !imageFile && 'text-gray-400'}`}/>
        </button>
      </form>
    </div>
  )
}

export default MessageInput