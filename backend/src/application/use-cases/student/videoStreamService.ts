import { generateSignedUrl } from "../../../infrastructure/cloud/cloudinary";
import { ICourseRepository } from "../../repositories/ICourseRepository";

export class GetSecureVideoUrlService{
    constructor(private courseRepository : ICourseRepository) {}

    async execute(courseId: string, videoId: string): Promise<string | null> {
        const videoPublicId = await this.courseRepository.getVideoPublicUrl(courseId, videoId) ;
        if(!videoPublicId) return null;
        const secureUrl = generateSignedUrl(videoPublicId)
        if(!secureUrl) return null;
        return secureUrl;
    }
}