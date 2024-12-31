import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface WishlistState {
    courseIds:string[]
}

const initialState : WishlistState = {
    courseIds: []
}

const wishlistSlice = createSlice({
    name:'wishlist',
    initialState,
    reducers: {
        setWishlistIds (state, action : PayloadAction<{courseIds : string[] | []}>){
            state.courseIds = action.payload.courseIds;
        },
        addIdToWishlist(state, action: PayloadAction<{courseId: string}>){
            state.courseIds.push(action.payload.courseId)
        },
        removeIdFromWishlist(state, action:PayloadAction<{courseId: string}>){
            state.courseIds = state.courseIds.filter(item => item !== action.payload.courseId)
        }
    }
})


export const {addIdToWishlist, removeIdFromWishlist,setWishlistIds} = wishlistSlice.actions;
export default wishlistSlice.reducer;