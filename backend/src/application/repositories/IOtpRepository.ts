export interface IOtpRepository {
    generateOtp(email: string, otp: string, expiresAt: Date): Promise<void>
    verifyOtp(email: string, otp: string): Promise<boolean>
}