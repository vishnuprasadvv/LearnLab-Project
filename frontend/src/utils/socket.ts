import { io } from 'socket.io-client';
import { config } from '@/config/config';

const socket = io(config.app.BASE_URL);
export default socket;