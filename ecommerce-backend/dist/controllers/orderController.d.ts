import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
export declare const createOrder: (req: AuthRequest, res: Response) => void;
export declare const getUserOrders: (req: AuthRequest, res: Response) => void;
export declare const getOrderById: (req: AuthRequest, res: Response) => void;
export declare const getAllOrders: (req: AuthRequest, res: Response) => void;
export declare const updateOrderStatus: (req: AuthRequest, res: Response) => void;
//# sourceMappingURL=orderController.d.ts.map