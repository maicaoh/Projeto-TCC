import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Room } from "./Room";

@Entity('Videos')
export class Video{
    @PrimaryGeneratedColumn()
    id: number

    @Column({type:'text'})
    title: string

    @Column({type:'text'})
    url: string

    @Column({type:'text'})
    description: string


    @ManyToOne(()=>Room,room => room.videos)
    @JoinColumn({name:'room_id'})
    Room: Room

}