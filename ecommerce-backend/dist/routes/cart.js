"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const cartController_1 = require("../controllers/cartController");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// All cart routes require authentication
router.get('/', auth_1.authenticateToken, cartController_1.getCart);
router.post('/add', auth_1.authenticateToken, cartController_1.addToCart);
router.put('/:id', auth_1.authenticateToken, cartController_1.updateCartItem);
router.delete('/:id', auth_1.authenticateToken, cartController_1.removeFromCart);
router.delete('/', auth_1.authenticateToken, cartController_1.clearCart);
exports.default = router;
//# sourceMappingURL=cart.js.map