import { body, ValidationChain } from 'express-validator';

export const registerValidation: ValidationChain[] = [
  body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('firstName').trim().isLength({ min: 1 }).withMessage('First name required'),
  body('lastName').trim().isLength({ min: 1 }).withMessage('Last name required')
];

export const loginValidation: ValidationChain[] = [
  body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
  body('password').exists().withMessage('Password required')
];

export const productValidation: ValidationChain[] = [
  body('name').trim().isLength({ min: 1 }).withMessage('Product name required'),
  body('price').isFloat({ min: 0 }).withMessage('Valid price required'),
  body('categoryId').isInt({ min: 1 }).withMessage('Valid category ID required'),
  body('stockQuantity').isInt({ min: 0 }).withMessage('Valid stock quantity required')
];

export const orderValidation: ValidationChain[] = [
  body('items').isArray({ min: 1 }).withMessage('Order must contain at least one item'),
  body('items.*.productId').isInt({ min: 1 }).withMessage('Valid product ID required'),
  body('items.*.quantity').isInt({ min: 1 }).withMessage('Valid quantity required'),
  body('shippingAddress').trim().isLength({ min: 10 }).withMessage('Valid shipping address required')
];