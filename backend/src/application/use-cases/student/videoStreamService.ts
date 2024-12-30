import { generateSignedUrl } from "../../../infrastructure/cloud/cloudinary";
import { ICourseRepository } from "../../repositories/ICourseRepository";

export class GetSecureVideoUrlService{
    constructor(private courseRepository : ICourseRepository) {}

    async execute(courseId: string, videoId: string): Promise<string | null> {
        const videoPublicId = await this.courseRepository.getVideoPublicUrl(courseId, videoId) ;
        console.log('Retrieved Public ID:', videoPublicId);
        if(!videoPublicId) return null;
        const secureUrl = generateSignedUrl(videoPublicId)
        console.log('secureurl' , secureUrl)
        if(!secureUrl) return null;
        return secureUrl;
    }
}