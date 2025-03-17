import User from '../models/usersModel';
import jwt from 'jsonwebtoken';
import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';

const generateToken = (id: string) => {
    return jwt.sign({ id }, process.env.JWT_SECRET as string, { expiresIn: "1d" });
};

// req body for register (ensure these are required)
interface RegisterRequestBody {
    fullName: string;
    email: string;
    password: string;
}

// Register user
// {} = Params, Body, Headers, and Query types
const registerUser = async (req: Request<{}, {}, RegisterRequestBody>, res: Response): Promise<void> => {
    const { fullName, email, password } = req.body;

    try {
        // Check if the user already exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            res.status(400).json({ message: 'User already exists' });
            return
        }

        // Hash password before storing
        const hashedPassword = await bcrypt.hash(password, 10);
                
        // Create user with hashed password
        const user = await User.create({
            fullName,
            email,
            password: hashedPassword
        });

        // If user is successfully created, send response
        if (user) {
            res.status(200).json({
                _id: user._id,
                fullName: user.fullName,
                email: user.email,
                token: generateToken(user.id)
            });
        } else {
            res.status(500).json({ message: "User registration failed" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

// req body for register
interface userRequestBody {
    email: string,
    password: string
}

const loginUser = async (req: Request<{}, {}, userRequestBody>, res: Response) => {
    const { email, password } = req.body;

    try {

        const user = await User.findOne({ email });

        if(user && (await user.matchPassword(password))) {
            res.status(200).json({
                _id: user._id,
                fullName: user.fullName,
                email: user.email,
                token: generateToken(user.id)
            });
        } else {
            res.status(400).json({ message: "Invalid username or password"});
        }
    }  catch (error) {
        res.status(500).json({ message: "Something went wrong" });
    }
}

interface profileQuery {
    email: string
}

// req body for getProfile
const getProfile = async (req: Request<{}, {}, {}, { email: string }>, res: Response): Promise<void> => {
    const { email } = req.query;
        
    try{
        const user = await User.findOne({ email });

        if(!user) {
            res.status(400).json({ message: 'User not found '});
            return
        }

        res.status(200).json({
            fullName: user.fullName,
            email: user.email
        });

    } catch (error) {
        res.status(500).json({ message: "Something went wrong" });
    }
}

export { registerUser, loginUser, getProfile};
