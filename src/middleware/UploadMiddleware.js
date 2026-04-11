const multer = require("multer")

const storage  = multer.memoryStorage({
    destination:"./uploads",
    filename:(req,file,cb)=>{
        cb(null,file.originalname)

    }
})

const upload = multer({
    storage:storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB સુધીની ફાઇલ
    }
})

module.exports = upload