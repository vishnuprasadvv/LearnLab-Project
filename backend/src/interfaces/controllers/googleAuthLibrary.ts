import { NextFunction, Request, Response } from "express";
import { generateAccessToken, generateRefreshToken } from "../../utils/jwtHelper";
import User from "../../domain/models/User";
import axios from "axios";
import { accessTokenOptions } from "../../infrastructure/config/jwt";
import { UserRepositoryImpl } from "../../infrastructure/repositories/userRepositoryImpl";


const userRepo = new UserRepositoryImpl()

export const googleLogin = async (req: Request, res: Response , next: NextFunction): Promise<any | void> => {
    
    try {
        const { token } = req.body;
        if (!token) {
            return res.status(400).json({ message: "Token is required" });
          }
          const googleUserResponse = await axios.get(`https://www.googleapis.com/oauth2/v3/userinfo`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
        })

        const payload = googleUserResponse.data; // This contains the user data
      if (!payload) {
        return res.status(400).json({ message: "Invalid token" });
      }
         // Check if user exists in the database
    let user = await userRepo.getUserByEmail(payload.email)
    if (!user) {
      // Create a new user
      user = await User.create({
        googleId: payload.sub,
        email: payload.email!,
        firstName: payload.given_name!,
        lastName: payload.family_name!,
        profileImageUrl: payload.picture!,
        isVerified: true
      });
    }
  
      // Create custom JWT
      const accessToken = generateAccessToken({
        id: user._id,
        role:user.role
      })
      const refreshToken = generateRefreshToken({id: user._id})

      res.cookie('accessToken', accessToken, accessTokenOptions)
      res.cookie('refreshToken', refreshToken, accessTokenOptions)
  
      res.status(200).json({
        token: accessToken,
        user: {
          _id: user._id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          profileImageUrl : user.profileImageUrl,
          role: user.role
        },
      });
      
    } catch (error) {
      console.error("Error verifying token:", error);
      res.status(500).json({ message: "Internal server error" });
    }
}