import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Equipe_Tecnico } from "./Equipe_Tecnico";


@Entity("coach")

export class Coach{


    @PrimaryGeneratedColumn("uuid")
    id: string

    @Column({type:'timestamp',nullable:true})
    createAt : Date;

    @Column({type:'timestamp',nullable:true})
    updateAt : Date;

    @Column({type:'bool',nullable:false})
    isDeleted : Boolean

    @Column({type: 'text',nullable: false})
    name: string

    @Column({type: 'text',nullable: true})
    apelido: string

    @Column({type: 'varchar', length: 11, nullable: true })
    cpf: string

    @Column({type:'timestamp',nullable:false})
    dataNascimento : Date;

    @Column({ type: "text", nullable: true })
    foto: string;

    @Column({type: 'text',nullable: true})
    email: string

    @Column({type: 'text',nullable: true})
    telefone: string

    @OneToMany(()=>Equipe_Tecnico,equipeTecnico => equipeTecnico.coach)
    equipeTecnico:Equipe_Tecnico[]

}