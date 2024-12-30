import { config } from "@/config/config"

export const getVideoUrl = (courseId: string, videoId: string) => {
    const baseUrl = config.app.PORT || '';
    if(!courseId || !videoId){
        console.error('Missing required parameters for video URL.');
        return '';
    }
    return `${baseUrl}/student/stream/${courseId}/${videoId}`
}