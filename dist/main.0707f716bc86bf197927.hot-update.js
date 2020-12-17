exports.id = "main";
exports.modules = {

/***/ "./src/models/users/users.router.ts":
/*!******************************************!*\
  !*** ./src/models/users/users.router.ts ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nvar __importDefault = (this && this.__importDefault) || function (mod) {\n    return (mod && mod.__esModule) ? mod : { \"default\": mod };\n};\nObject.defineProperty(exports, \"__esModule\", { value: true });\nexports.usersRouter = void 0;\n/**\n * Required External Modules and Interfaces\n */\nvar jwt = __webpack_require__(/*! jsonwebtoken */ \"jsonwebtoken\");\nconst express_1 = __importDefault(__webpack_require__(/*! express */ \"express\"));\n/**\n * Router Definition\n */\nexports.usersRouter = express_1.default.Router();\n/**\n * @swagger\n * /users/login:\n *   post:\n *     description: Login to the application\n *     produces:\n *       - application/json\n *     tags:\n *       - User\n *     parameters:\n *       - name: user\n *         description: Username to use for login.\n *         in: formData\n *         required: true\n *         type: string\n *       - name: password\n *         description: User's password.\n *         in: formData\n *         required: true\n *         type: string\n *     responses:\n *       200:\n *         description: login\n */\nexports.usersRouter.post('/login', function (req, res) {\n    if (req.body.user === \"admin\" && req.body.password === \"admin\") {\n        var token = jwt.sign({ id: 1 }, \"RANDOM_TOKEN_SECRET\", {\n            expiresIn: 86400\n        });\n        res.status(200).send({ auth: true, token: token });\n    }\n    else {\n        res.status(404).send({ auth: false, token: null });\n    }\n});\n\n\n//# sourceURL=webpack:///./src/models/users/users.router.ts?");

/***/ })

};