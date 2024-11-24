import User from "../../../domain/models/User";


export const getAllUsers = async () =>{
    const users = await User.find()
    return users
}

export const deleteUser = async (userid: string) => {
    const deletedUser = await User.findByIdAndDelete(userid)
    return deleteUser
}