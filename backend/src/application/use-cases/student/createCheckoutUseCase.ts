import { StripeService } from "../../../infrastructure/stripe/StripeService";

export class CreateCheckoutUseCase {
    private stripeService : StripeService

    constructor(stripeService: StripeService){
        this.stripeService = stripeService;
    }

    async execute(courses:any[], userId: string) : Promise<string>{
        return await this.stripeService.createCheckOutSession(courses, userId)
    }
}