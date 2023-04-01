import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CloudinaryModule } from 'nestjs-cloudinary';



@Module({
    imports: [
        ConfigModule,
        CloudinaryModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: (configService: ConfigService) => ({
                // gar: configService.get('CLOUDINARY_NAME'),
                isGlobal: true,
                cloud_name: process.env.CLOUDINARY_NAME,
                api_key: process.env.CLOUDINARY_API_KEY,
                api_secret: process.env.CLOUDINARY_API_SECRET,
                secure: true
            })

        }),
        
    ]
})

export class NestCloudinaryModule {}
