import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CloudinaryService } from 'nestjs-cloudinary';
import * as fs from 'fs';
import { User } from 'src/auth/entities';
import { PreviewOptions } from './interfaces';

@Injectable()
export class FilesService {

  constructor(
    
    private readonly cloudinaryService: CloudinaryService,
    private readonly configService: ConfigService
  ){}
  
  async uploadFileToCloud( file: Express.Multer.File, user: User ){
    try {

      const path = `${file.destination}/${ file.filename }`

      const fileUpload =  await this.cloudinaryService.cloudinary.uploader.upload(path, {
        folder: `videos/${ user.username }/videos`,
        resource_type: 'video'
      })

      fs.rm(path, (err) => {
        if (err) {
          console.log(err);
          return;
        }
      })

      return fileUpload.secure_url

    } catch (error) {

      console.log(error)
      throw new  InternalServerErrorException('Error, please try again ')
    }
  
  }

  async uploadAvatarUser(file: Express.Multer.File, user: User){
    try {
      const path = `${file.destination}/${ file.filename }`;
      const fileUpload =  await this.cloudinaryService.cloudinary.uploader.upload(path, {
        folder: `avatar/${ user.username }`,
        resource_type: 'image'
      })

      fs.rm(path, (err) => {
        if (err) {
          console.log(err);
          return;
        }
      })

      return fileUpload.secure_url;

    } catch (error) {
      throw new InternalServerErrorException(`Error to uploading video, please try again`)
    }
    
  }
  async uploadImagePreview( file: Express.Multer.File, user: User, fileOptions: PreviewOptions ){

    try {
      const path = `${file.destination}/${ file.filename }`;

    const fileUpload = await this.cloudinaryService.cloudinary.uploader.upload(path, {
      folder: `videos/${ user.username }/${ fileOptions }`,
      resource_type: 'image'
    })

    fs.rm(path, (err) => {
      if (err) {
        console.log(err);
        return;
      }
    })

    return fileUpload.secure_url;

    } catch (error) {
      throw new InternalServerErrorException(`Error to uploading image, please try again`)
    }
    
  }

  async uploadAudio(file: Express.Multer.File, user: User){

    try {
      const path = `${file.destination}/${ file.filename }`;

    const fileUpload = await this.cloudinaryService.cloudinary.uploader.upload(path, {
      folder: `audios/${ user.username }/audios`,
      resource_type: 'video'
    })

    fs.rm(path, (err) => {
      if (err) {
        console.log(err);
        return;
      }
    })

    fileUpload.public_id

    return fileUpload.secure_url;

    } catch (error) {
      console.log(error)
      throw new InternalServerErrorException(`Error to uploading audio, please try again`)
    }

  } 

}
