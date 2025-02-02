import { Request, Response } from "express";
import Stripe from "stripe";
import { OrderRepository } from "../../../../infrastructure/repositories/orderRepository";
import { config } from "../../../../infrastructure/config/config";
import { CourseRepositoryClass } from "../../../../infrastructure/repositories/courseRepository";

const stripe = new Stripe(config.stripe.STRIPE_SECRET_KEY!, { apiVersion: "2024-12-18.acacia" });
const orderRepository = new OrderRepository();
const courseRepository = new CourseRepositoryClass();

export const handleWebhook = async (req: Request, res: Response): Promise<void> => {
   
    const signature = req.headers["stripe-signature"]!;
    const webhookSecret = config.stripe.STRIPE_WEBHOOK_SECRET!;

    let event: Stripe.Event;

    try {
        // Verify the Stripe signature
        event = stripe.webhooks.constructEvent(req.body, signature, webhookSecret);
    } catch (err:any) {
        console.error("Webhook signature verification failed:", err);
        res.status(400).send(`Webhook Error: ${err.message}`);
        return;
    }

    // Handle different event types
    switch (event.type) {
        case "checkout.session.completed":
            await handleCheckoutSessionCompleted(event);
            break;

        case "payment_intent.succeeded":
            console.log("PaymentIntent succeeded:", event.data.object);
            break;
        case "payment_intent.payment_failed":
            await handlePaymentFailed(event);
            break;

        default:
            console.log(`Unhandled event type: ${event.type}`);
    }

    res.status(200).send("Webhook received and processed successfully.");
};

const handleCheckoutSessionCompleted = async (event: Stripe.Event): Promise<void> => {
    const session = event.data.object as Stripe.Checkout.Session;
    console.log('from webhook chekcout',session)

    // Retrieve metadata (userId and courseIds from the session)
    const userId = session.metadata?.userId;
    const courses = JSON.parse(session.metadata?.courses || "[]");


    if (!userId || courses.length === 0) {
        console.error("Invalid session metadata.");
        return;
    }

    // Update the order in the database
    const order = await orderRepository.getOrderById(session.metadata?.orderId as string);
    if (!order) {
        console.error(`Order with session ID ${session.id} not found.`);
        return;
    }

    await orderRepository.updateOrder(order.orderId, {
        paymentStatus: "completed",
        transactionId: session.payment_intent as string,
        paymentDate: new Date(),
    });

    console.log(`Order ${order.orderId} marked as completed.`);

    for(const course of courses) {
        const {courseId} = course;
        try{
        if(!courseId) {
            console.error('Course ID is missing in the course object:', course)
        }
            await courseRepository.incrementEnrolledCount(courseId);
            console.log(`Enrolled count incremented for course:${courseId}`)
        }catch(error){
            console.error(`Failed to update enrolled count for course: ${courseId}`, error)
        }
    }
};


const handlePaymentFailed = async (event: Stripe.Event): Promise<void> => {
    const paymentIntent = event.data.object as Stripe.PaymentIntent;
    console.error('Payment failed:', paymentIntent);

    // Retrieve the order ID from metadata
    const orderId = paymentIntent.metadata?.orderId;
    if (!orderId) {
        console.error("Order ID missing in payment intent metadata.");
        return;
    }

    // Update the order in the database to reflect payment failure
    const order = await orderRepository.getOrderById(orderId);
    if (!order) {
        console.error(`Order with ID ${orderId} not found.`);
        return;
    }

    await orderRepository.updateOrder(order.orderId, {
        paymentStatus: "failed",
        paymentDate: new Date(),
    });

    console.log(`Order ${order.orderId} marked as failed due to payment failure.`);
};