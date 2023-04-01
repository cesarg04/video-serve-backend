import { User } from "src/auth/entities/USER.entity";
import { Comments } from "src/comments/entities/comment.entity";
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";


@Entity({ name: 'videos' })
export class Video {

    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column('text', {
        nullable: false
    })
    title: string

    @Column('text', {
        nullable: false
    })
    url: string

    @Column('text', {
        nullable: true,
    })
    descriptions: string

    @ManyToOne(
        () => User,
        ( user ) => user.videos
    )
    user: User

    @OneToMany(
        () => Comments,
        ( comments ) => comments.id
    )
    comments: Comments
}
