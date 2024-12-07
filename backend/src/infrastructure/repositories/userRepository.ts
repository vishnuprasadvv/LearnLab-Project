import { IUser } from "../../domain/models/User";

const users:IUser[] = [];

export const updateUserProfileImage = async (userId: string, profileImageUrl : string) : Promise<IUser | null> => {
    const user = users.find((user) => user.id === userId)
    if(!user) return null;
    user.profileImageUrl = profileImageUrl;
    return user;
}