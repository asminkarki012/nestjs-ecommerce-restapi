import { Injectable } from "@nestjs/common";
import toStream = require("buffer-to-stream");
import { UploadApiErrorResponse, UploadApiResponse, v2 } from "cloudinary";

@Injectable()
export class CloudinaryService {
  async uploadImage(
    file: Express.Multer.File
  ): Promise<UploadApiResponse | UploadApiErrorResponse | any> {
    console.log("cloudinary service working");
    return new Promise((resolve, reject) => {
      const upload = v2.uploader.upload_stream((error, result) => {
        if (error) return reject(error);
        resolve(result);
      });
      toStream(file.buffer).pipe(upload);
    });
  }
}
