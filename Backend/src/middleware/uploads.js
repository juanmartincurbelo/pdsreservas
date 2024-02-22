const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { UploadError } = require('../errors/uploads-errors');
const { isImageType } = require('../utils/common');

const imageStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        const buildingData = JSON.parse(req.body.jsonData);
        const buildingPath = path.join(__dirname, '../../../Frontend/assets/', "files");
        if (!fs.existsSync(buildingPath)) {
            fs.mkdirSync(buildingPath, { recursive: true });
        }
        cb(null, buildingPath);
    },
    filename: function (req, file, cb) {
        const err = new Error();
        try {
            const buildingData = JSON.parse(req.body.jsonData);
            const imageName = buildingData.name + ' - ' + buildingData.address + ".jpg";
            const pdfName = buildingData.name + ' - ' + buildingData.address + "." + file?.mimetype?.split('/')[1];
            const fileName = file.fieldname === 'image' ? imageName : pdfName;
            const buildingPath = path.join(__dirname, '../../../Frontend/assets/', "files");

            const archiveFile = path.join(buildingPath, fileName);
            if (fs.existsSync(archiveFile)) {
                throw new UploadError('El nombre del archivo ya existe. Por favor cambia el nombre del archivo.', 400);
            } else {
                cb(null, fileName);
            }
        } catch (error) {
            cb(error, false);
        }
    }
});

const imageLimits = {
    fileSize: 5 * 1024 * 1024,
    files: 2
};

const fileFilterForImages = function (req, file, cb) {
    if (file.fieldname == 'image') {
        if (isImageType(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new UploadError('El formato del archivo no es soportado', 400), false);
        }
    } else if (file.fieldname == 'documentation') {
        if (file.mimetype === 'application/pdf' || isImageType(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new UploadError('El formato del archivo no es soportado', 400), false);
        }
    } else {
        cb(new UploadError('El formato del archivo no es soportado', 400), false);
    }
};

const imageUpload = multer({
    storage: imageStorage,
    fileFilter: fileFilterForImages,
    limits: imageLimits
});

module.exports = imageUpload;