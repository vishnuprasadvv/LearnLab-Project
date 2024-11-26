import { NextFunction, Request, Response } from "express";
import { OAuth2Client ,} from "google-auth-library";
import { generateAccessToken } from "../../utils/jwtHelper";
import User from "../../domain/models/User";
import axios from "axios";

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID!
const client = new OAuth2Client(GOOGLE_CLIENT_ID)


export const googleLogin = async (req: Request, res: Response , next: NextFunction): Promise<any | void> => {

    console.log('googlelogin')
    
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
        
        console.log(googleUserResponse.data)
      if (!payload) {
        return res.status(400).json({ message: "Invalid token" });
      }

         // Check if user exists in the database
    let user = await User.findOne({ email: payload.email });
    if (!user) {
      // Create a new user
      user = await User.create({
        googleId: payload.sub,
        email: payload.email!,
        firstName: payload.given_name!,
        lastName: payload.family_name!,
        //picture: payload.picture!,
        isVerified: true
      });
    }
  
      // Create custom JWT
      const jwtToken = generateAccessToken({
        id: payload.sub,
        email: payload.email,
        firstName: payload.given_name!,
        lastName: payload.family_name!,
        picture: payload.picture,
      })
  
      res.status(200).json({
        token: jwtToken,
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          //picture: user.picture,
          role: user.role
        },
      });
      
    } catch (error) {
      console.error("Error verifying token:", error);
      res.status(500).json({ message: "Internal server error" });
    }
}