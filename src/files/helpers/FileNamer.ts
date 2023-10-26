import { v4 as uuid } from "uuid";


export const fileNamer = ( req: Express.Request, file: Express.Multer.File, callback: Function ) => {
    if (!file) return callback( new Error('File is empty'), false );

    const { body } = req as any;

    if (!body.title) {
        return callback(null, file.originalname)
    }

    const fileExtension = file.mimetype.split('/')[1];

    const fileName = `${ uuid() }.${ fileExtension }`;


    callback(null, fileName)

}
