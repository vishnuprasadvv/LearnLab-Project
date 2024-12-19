import  express,{ Router } from "express";
import { handleWebhook } from "../controllers/student/order/stripeWebhookController";


const router = Router();

router.post ('/webhook/stripe', express.raw({ type: 'application/json' }), handleWebhook)

export default router;