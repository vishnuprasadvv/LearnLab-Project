import mongoose , {Schema, Document, Model} from "mongoose";

interface IVideo {
    title: string;
    url: string;
    duration: number;
    isFree: boolean
}

interface ILectureDocument extends Document{
    title: string,
    description: string,
    course: mongoose.Types.ObjectId;
    videos: IVideo[];
    order : number;
    createdAt: Date;
    updatedAt: Date;
    isFree: boolean
}

const VideoSchema : Schema = new Schema({
    title : {type: String, required: true, trim: true},
    url : {type: String, required :true},
    duration: {type: Number, required: true, min: 0},
    isFree: {type: Boolean , default: false}
})

const LectureSchema : Schema <ILectureDocument> = new Schema ( 
    {
        title: {type: String, required: true, trim: true},
        description: {type: String},
        course: {type: Schema.Types.ObjectId, ref : 'Courses', required: true},
        videos: {type: [VideoSchema], default: []},
        order: {type: Number, required: true, min: 1},
        isFree: {type: Boolean , default: false},
    },
    {timestamps: true}
)

const Lecture : Model<ILectureDocument> = mongoose.model<ILectureDocument>('Lecture', LectureSchema);
export default Lecture;