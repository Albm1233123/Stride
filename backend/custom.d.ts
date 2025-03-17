// custom.d.ts

import { User } from './models/usersModel'; 

declare global {
  namespace Express {
    interface Request {
      user?: User;  // Declare 'user' property on Request object
    }
  }
}
