import cloudinary from "cloudinary";

export function parseJwt(token: string) {
  return JSON.parse(Buffer.from(token.split(".")[1], "base64").toString());
}

export async function uploadImages(imageFiles: Express.Multer.File[]) {
  const uploadPromises = imageFiles.map(async (item) => {
    const b64 = Buffer.from(item.buffer).toString("base64");
    let dataUri = "data:" + item.mimetype + ";base64," + b64;
    const res = await cloudinary.v2.uploader.upload(dataUri);
    return res.url;
  });
  const imageUrls = await Promise.all(uploadPromises);
  return imageUrls;
}
