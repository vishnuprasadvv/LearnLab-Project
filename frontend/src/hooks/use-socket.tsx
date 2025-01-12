// useSocket.ts (Custom Hook)
import { useEffect } from 'react';
import { useAppDispatch } from '@/app/hooks';
import { setOnlineUsers, resetOnlineUsers } from '@/features/chatSlice';
import socket from '@/utils/socket';

export const useSocket = (currentUser: any) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (currentUser) {
      socket.emit('setUserOnline', currentUser._id);
    }

    socket.on('updateUserStatus', (users: any) => {
      dispatch(setOnlineUsers(users));
    });

    return () => {
        socket.emit('setUserOffline', currentUser._id)
      socket.off('updateUserStatus');
      dispatch(resetOnlineUsers());
    };
  }, [dispatch, currentUser]);

  return socket;
};
