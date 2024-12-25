// useSocket.ts (Custom Hook)
import { useEffect } from 'react';
import { useAppDispatch } from '@/app/hooks';
import { setOnlineUsers, resetOnlineUsers } from '@/features/chatSlice';
import { io } from 'socket.io-client';
import { config } from '@/config/config';

const socket = io(config.app.BASE_URL);

export const useSocket = (currentUser: any) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (currentUser) {
      socket.emit('setUserOnline', currentUser._id);
    }

    socket.on('updateUserStatus', (users: any) => {
      dispatch(setOnlineUsers(users));
      console.log('onlineusers ',users)
    });

    return () => {
        console.log('return chat main')
        socket.emit('setUserOffline', currentUser._id)
      socket.off('updateUserStatus');
      dispatch(resetOnlineUsers());
    };
  }, [dispatch, currentUser]);

  return socket;
};
