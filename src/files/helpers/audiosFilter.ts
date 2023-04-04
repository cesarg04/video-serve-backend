
export const audiosFilter = (req: Express.Request, file: Express.Multer.File, callback: Function) => {

    if (!file) return callback(new Error('audio is empty'), false);

    const fileExtension = file.mimetype.split('/')[1]

    const validExtension = ['mp3', 'm4a', 'wav', 'flac', 'mpeg']

    if (validExtension.includes(fileExtension)) {
        return callback(null, true)
    }

    callback(null, false)

}
