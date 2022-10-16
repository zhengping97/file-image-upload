const path = require('path')
const { StatusCodes } = require('http-status-codes')
const CustomError = require('../errors');
const cloudinary = require('cloudinary').v2
const fs = require('fs')

const uploadProductImageLocal = async (req, res) => {
    // console.log(req.files)
    if (!req.files) { // check if file exists
        throw new CustomError.BadRequestError('No File Uploaded')
    }
    let productImage = req.files.image;

    if (!productImage.mimetype.startsWith('image')) { // check format
        throw new CustomError.BadRequestError('Please Upload Image');
    }

    const maxSize = 1024 * 1024;

    if (productImage.size > maxSize) { // check size
        throw new CustomError.BadRequestError('Please upload imager smaller than 1KB');
    }

    const imagePath = path.join(__dirname, '../public/uploads/' + `${productImage.name}`)

    await productImage.mv(imagePath);
    return res.status(StatusCodes.OK).json({ image: { src: `/uploads/${productImage.name}` } });
}

const uploadProductImage = async (req, res) => {
    //console.log(req.files.image)
    const result = await cloudinary.uploader.upload(req.files.image.tempFilePath, {
        use_filename: true, folder: 'file_upload',
    });
    fs.unlinkSync(req.files.image.tempFilePath);
    return res.status(StatusCodes.OK).json({ image: { src: result.secure_url } });
}

module.exports = {
    uploadProductImage,
};