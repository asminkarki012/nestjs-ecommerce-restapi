import { v2 } from "cloudinary";
import keys from "src/config/keys";
import { CLOUDINARY } from "./constants";


export const CloudinaryProvider = {
  provide: CLOUDINARY,
  useFactory: ()  => {
    return v2.config({
      cloud_name: keys.CLOUD_NAME,
      api_key: keys.CLOUD_APIKEY,
      api_secret: keys.CLOUD_APISECRET,
    });
  },
};
