import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CloudinaryService } from 'nestjs-cloudinary';
import * as fs from 'fs';

@Injectable()
export class FilesService {

  constructor(
    
    private readonly cloudinaryService: CloudinaryService,
    private readonly configService: ConfigService
  ){}
  
  async uploadFileToCloud( file: Express.Multer.File ){
    try {

      const path = `${file.destination}/${ file.filename }`

      const fileUpload =  await this.cloudinaryService.cloudinary.uploader.upload(path, {
        folder: `videos`,
        resource_type: 'video'
      })

      // console.log(path2.join(__dirname))

      fs.rm(path, (err) => {
        if (err) {
          console.log(err);
          return;
        }
      })

      return fileUpload.secure_url


      // console.log(this.cloudinaryService.cloudinary.uploader.upload())
      // return 'hello'

    } catch (error) {

      console.log(error)
      throw new  InternalServerErrorException('Error, please try again ')
    }
  

  }


}
