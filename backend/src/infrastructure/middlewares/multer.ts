import multer from "multer";

const storage = multer.memoryStorage();

export const upload = multer({
    storage, 
    limits:{fileSize : 5 * 1024 * 1024} ,// limit is 5MB
    fileFilter:(req,file, cb:any)=> {
        if(file.mimetype.startsWith('image/')){
            cb(null, true);
        }else{
            cb(new Error('Only image files are allowed'), false)
        }
    }
})


export const uploadVideo = multer({ storage });