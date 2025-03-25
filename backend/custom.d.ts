// custom.d.ts
import { Request } from 'express';
import { User } from './models/usersModel'; 

declare global {
  namespace Express {
    interface Request {
      user?: User;  // Declare 'user' property on Request object
    }
  }
}
