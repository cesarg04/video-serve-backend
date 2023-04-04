import { User } from "src/auth/entities";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('audios')
export class Audio {

    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column('text')
    title: string

    @Column('text', {
        nullable: true
    })
    description: string

    @Column('text')
    url: string

    @Column('text', {
        nullable: true
    })
    image_portal: string

    @ManyToOne(
        () => User,
        ( user ) => user.id
    )
    user: User

}
