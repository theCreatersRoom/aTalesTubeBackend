"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_validator_1 = require("express-validator");
const user_1 = __importDefault(require("../models/user"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const multer_1 = __importDefault(require("multer"));
const helper_1 = require("../utils/helper");
const auth_1 = require("../middleware/auth");
const storage = multer_1.default.memoryStorage();
const upload = (0, multer_1.default)({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024,
    },
});
const router = express_1.default.Router();
router.post("/register", upload.single("profilePicture"), [
    (0, express_validator_1.check)("username", "Username is required").not().isEmpty(),
    (0, express_validator_1.check)("email", "Email is required").isEmail(),
    (0, express_validator_1.check)("password", "Password must be of minimum 6 length").isLength({
        min: 6,
    }),
    (0, express_validator_1.check)("name", "Name is required").not().isEmpty(),
], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty())
        return res.status(400).json({ message: errors.array() });
    const { username, email, password, name, mobile } = req.body;
    const profile = req.file;
    try {
        const user = yield user_1.default.findOne({ email });
        if (user) {
            return res.status(400).json({ message: "User already exists" });
        }
        const salt = yield bcryptjs_1.default.genSalt(10);
        const passwordHash = yield bcryptjs_1.default.hash(password, salt);
        const imageUrls = yield (0, helper_1.uploadImages)([profile]);
        const profilePicture = imageUrls[0];
        const newUser = new user_1.default({
            username,
            email,
            passwordHash,
            name,
            mobile,
            profilePicture: profilePicture || null,
        });
        const savedUser = yield newUser.save();
        const token = jsonwebtoken_1.default.sign({ userId: savedUser._id }, process.env.JWT_SECRET_KEY);
        res.status(201).json({ token });
    }
    catch (err) {
        console.log("🚀 ~ err:", err);
        return res.status(500).json({ message: "Something went wrong" });
    }
}));
router.get("/", auth_1.verifyToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const pageSize = 10;
        const page = Number(req.query.pageNumber) || 1;
        const keyword = req.query.keyword
            ? {
                username: {
                    $regex: req.query.keyword,
                    $options: "i",
                },
            }
            : {};
        const count = yield user_1.default.countDocuments(Object.assign({}, keyword));
        const users = yield user_1.default.find(Object.assign({}, keyword))
            .limit(pageSize)
            .skip(pageSize * (page - 1));
        res.json({ users, page, pages: Math.ceil(count / pageSize) });
    }
    catch (err) {
        console.log("🚀 ~ err:", err);
    }
}));
router.post("/updateUser", auth_1.verifyToken, upload.single("profilePicture"), [
    (0, express_validator_1.check)("id", "Invalid id").isMongoId(),
    (0, express_validator_1.check)("name", "Invalid name").isLength({ min: 3, max: 20 }),
], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield user_1.default.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        user.name = req.body.name;
        if (req.file) {
            const imageUrl = yield (0, helper_1.uploadImages)([req.file]);
            user.profilePicture = imageUrl[0];
        }
        user.save();
        res.json(user);
    }
    catch (err) {
        console.log("🚀 ~ err:", err);
    }
}));
exports.default = router;
