const cloudinary = require("cloudinary").v2;
require("dotenv").config();

const uploadToCloudinary = (filePath) => {
    return new Promise((resolve, reject) => {
        // ૧. Cloudinary Config (જો આ app.js માં ન હોય તો અહીં રાખવું જરૂરી છે)
        cloudinary.config({
            cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
            api_key: process.env.CLOUDINARY_API_KEY,
            api_secret: process.env.CLOUDINARY_API_SECRET
        });

        // ૨. upload_stream ને બદલે uploader.upload વાપરો (કારણ કે તમારી પાસે ફાઈલ પાથ છે)
        cloudinary.uploader.upload(
            filePath, 
            { 
                resource_type: "auto", 
                folder: "wearweb_products" 
            },
            (error, result) => {
                if (error) {
                    console.error("Cloudinary Error:", error);
                    return reject(error);
                }
                resolve(result); // સક્સેસ થાય એટલે આખું રિઝલ્ટ મોકલો
            }
        );
    });
};

module.exports = uploadToCloudinary;