import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/auth';
export declare const getAllProducts: (req: Request, res: Response) => void;
export declare const getProductById: (req: Request, res: Response) => void;
export declare const createProduct: (req: AuthRequest, res: Response) => void;
export declare const updateProduct: (req: AuthRequest, res: Response) => void;
export declare const deleteProduct: (req: AuthRequest, res: Response) => void;
export declare const getCategories: (req: Request, res: Response) => void;
//# sourceMappingURL=productController.d.ts.map