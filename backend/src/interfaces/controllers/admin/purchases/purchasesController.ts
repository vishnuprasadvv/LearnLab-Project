import { NextFunction, Request, Response } from "express";
import { OrderRepository } from "../../../../infrastructure/repositories/orderRepository";
import { GetPurchasesUseCase } from "../../../../application/use-cases/admin/purchases/getPurchases";
import { CustomError } from "../../../middlewares/errorMiddleWare";

const orderRepository = new OrderRepository();
const getPurchasesUseCase = new GetPurchasesUseCase(orderRepository)
export const getPurchasesController = async(req:Request, res: Response, next:NextFunction) => {
    try {
        const purchases = await getPurchasesUseCase.execute()
        if(!purchases) throw new CustomError('Orders not found', 400)
            res.status(200).json({success: true, message: "All orders fetching success", data: purchases})
    } catch (error) {
        next(error)
    }
}