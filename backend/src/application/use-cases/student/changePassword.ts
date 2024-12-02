import User from "../../../domain/models/User"


export const changePassword = async(oldPassword:string, newPassword:string) => {
    
    const findUser = User.findOne
}