import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
export declare const getCart: (req: AuthRequest, res: Response) => void;
export declare const addToCart: (req: AuthRequest, res: Response) => void;
export declare const updateCartItem: (req: AuthRequest, res: Response) => void;
export declare const removeFromCart: (req: AuthRequest, res: Response) => void;
export declare const clearCart: (req: AuthRequest, res: Response) => void;
//# sourceMappingURL=cartController.d.ts.map