import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User, { IUser } from '../models/usersModel';  // Correctly import User and IUser

interface DecodedToken {
    id: string;
}

declare module 'express' {
    interface Request {
        user?: IUser;  // Declare 'user' property with IUser type
    }
}

const protect = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    let token: string | undefined;

    // Check for token in headers
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        try {
            // Get the token from the header
            token = req.headers.authorization.split(' ')[1];

            console.log('Token received in middleware:', token);  // Log the token

            // Verify the token
            const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as DecodedToken;

            console.log('Decoded token:', decoded);  // Log the decoded token

            // Find the user from the token and attach to req object
            req.user = await User.findById(decoded.id).select('-password');

            return next(); // Pass control to the next middleware/route handler
        } catch (error) {
            console.error(error);  // Log any error for debugging
            res.status(401).json({ message: 'Not authorized, token failed' });
            return 
        }
    }

    // No token provided
    if (!token) {
        res.status(401).json({ message: 'Not authorized, no token provided' });
        return 
    }
};

export { protect };
