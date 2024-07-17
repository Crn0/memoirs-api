import cloudinary from "../../configs/cloudinary.mjs";
import CloudinaryError from "../errors/cloudinaryError.mjs";
const INTERNAL_SERVER = 500;
const UNPROCESSABLE = 422;
const BAD_GATEWAY = 502

const httpCodeMessage = {
    400: 'NOT FOUND',
    401: 'UNAUTHORIZED',
    404: 'BAD REQUEST',
    422: 'UNPROCESSABLE',
    500: 'INTERNAL SERVER ERROR',
    502: 'BAD GATEWAY',

}

class Cloudinary {
    static async upload(file, user_folder, asset_folder, root_folder = 'memoirs') {
        try {
            const res = await cloudinary.uploader.upload(file, {
                asset_folder: `${root_folder}/${user_folder}/${asset_folder}`,
            });

            return res;
        } catch (error) {
            throw new CloudinaryError(httpCodeMessage[error.error?.http_code], error.error?.message || error.message, error.request_options, error.error?.http_code || 'File Error');
        }
    }

    static async update(file, public_id) {
        try {
            const res = await cloudinary.uploader.upload(file, {
                public_id,
                invalidate: true,
            })

            return res;
        } catch (error) {
            throw new CloudinaryError(httpCodeMessage[error.error?.http_code], error.error?.message || error.message, error.error?.http_code || error?.http_code)
        }
    }

    static async destroy(public_id) {
        try {
            await cloudinary.uploader.destroy(public_id, {
                invalidate: true,
            })
        } catch (error) {
            throw new CloudinaryError(httpCodeMessage[error.error?.http_code], error.error?.message || error.message, error.error?.http_code || error?.http_code)
        }
    }

    static async destroyFolder(folder) {
        try {
            /**
             * folder: {
                    type: String,
                    description: The full path of the empty folder to delete.
                }
             */
            await cloudinary.api.delete_folder(folder);
        } catch (error) {
            console.log(error.error.message, 'message')
            console.log(error.request_options, 'request_options')
            console.log(error.error?.http_code , 'error.error?.http_code ')


            throw new CloudinaryError(httpCodeMessage[error.error?.http_code], error.error?.message || error.message, error.error?.http_code || error?.http_code)
        }
    }
}

export default Cloudinary;