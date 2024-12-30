export interface IChat {
    _id?: string 
    participants: {
      firstName: string,
      lastName: string,
      profileImageUrl : string,
      role: string,
      _id: string
    } [];
    chatType: 'private' | 'group';
    chatName?: string | null;
    createdAt?: Date;
    updatedAt?: Date;
    unReadCount?:number
}
