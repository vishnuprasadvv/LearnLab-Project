import { Request } from 'express';

declare global {
  namespace Express {
    interface User {
      id: string;
      role: string; // Add role property here
    }

    interface Request {
      user?: User; // Update the Request interface
    }
  }
}