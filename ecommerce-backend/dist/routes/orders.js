"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const orderController_1 = require("../controllers/orderController");
const auth_1 = require("../middleware/auth");
const validation_1 = require("../utils/validation");
const router = (0, express_1.Router)();
// Customer routes
router.post('/', auth_1.authenticateToken, validation_1.orderValidation, orderController_1.createOrder);
router.get('/my-orders', auth_1.authenticateToken, orderController_1.getUserOrders);
router.get('/:id', auth_1.authenticateToken, orderController_1.getOrderById);
// Admin routes
router.get('/', auth_1.authenticateToken, auth_1.requireAdmin, orderController_1.getAllOrders);
router.put('/:id/status', auth_1.authenticateToken, auth_1.requireAdmin, orderController_1.updateOrderStatus);
exports.default = router;
//# sourceMappingURL=orders.js.map