import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "src/auth/entities/USER.entity";
import { Video } from "src/videos/entities/video.entity";

@Entity('comments')
export class Comments {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('text')
    content: string

    @ManyToOne(
        () => Video,
        ( video ) => video.comments
    )
    video: Video

    @ManyToOne(
        () => User,
        ( user ) => user.comments
    )
    user: User
}