"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderValidation = exports.productValidation = exports.loginValidation = exports.registerValidation = void 0;
const express_validator_1 = require("express-validator");
exports.registerValidation = [
    (0, express_validator_1.body)('email').isEmail().normalizeEmail().withMessage('Valid email required'),
    (0, express_validator_1.body)('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    (0, express_validator_1.body)('firstName').trim().isLength({ min: 1 }).withMessage('First name required'),
    (0, express_validator_1.body)('lastName').trim().isLength({ min: 1 }).withMessage('Last name required')
];
exports.loginValidation = [
    (0, express_validator_1.body)('email').isEmail().normalizeEmail().withMessage('Valid email required'),
    (0, express_validator_1.body)('password').exists().withMessage('Password required')
];
exports.productValidation = [
    (0, express_validator_1.body)('name').trim().isLength({ min: 1 }).withMessage('Product name required'),
    (0, express_validator_1.body)('price').isFloat({ min: 0 }).withMessage('Valid price required'),
    (0, express_validator_1.body)('categoryId').isInt({ min: 1 }).withMessage('Valid category ID required'),
    (0, express_validator_1.body)('stockQuantity').isInt({ min: 0 }).withMessage('Valid stock quantity required')
];
exports.orderValidation = [
    (0, express_validator_1.body)('items').isArray({ min: 1 }).withMessage('Order must contain at least one item'),
    (0, express_validator_1.body)('items.*.productId').isInt({ min: 1 }).withMessage('Valid product ID required'),
    (0, express_validator_1.body)('items.*.quantity').isInt({ min: 1 }).withMessage('Valid quantity required'),
    (0, express_validator_1.body)('shippingAddress').trim().isLength({ min: 10 }).withMessage('Valid shipping address required')
];
//# sourceMappingURL=validation.js.map