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
exports.uploadImages = exports.parseJwt = void 0;
const cloudinary_1 = __importDefault(require("cloudinary"));
function parseJwt(token) {
    return JSON.parse(Buffer.from(token.split(".")[1], "base64").toString());
}
exports.parseJwt = parseJwt;
function uploadImages(imageFiles) {
    return __awaiter(this, void 0, void 0, function* () {
        const uploadPromises = imageFiles.map((item) => __awaiter(this, void 0, void 0, function* () {
            const b64 = Buffer.from(item.buffer).toString("base64");
            let dataUri = "data:" + item.mimetype + ";base64," + b64;
            const res = yield cloudinary_1.default.v2.uploader.upload(dataUri);
            return res.url;
        }));
        const imageUrls = yield Promise.all(uploadPromises);
        return imageUrls;
    });
}
exports.uploadImages = uploadImages;
