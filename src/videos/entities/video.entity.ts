import { User } from "src/auth/entities/user.entity";
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

    @Column('text', {
        nullable: true
    })
    image_portal: string

    @ManyToOne(
        () => User,
        ( user ) => user.videos
    )
    user: User

    @OneToMany(
        () => Comments,
        ( comments ) => comments.id,
        {
            onDelete: 'CASCADE'
        }
    )
    comments: Comments

}
