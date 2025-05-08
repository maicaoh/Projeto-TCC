import { Column, Entity, ManyToMany, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Equipe_Jogador } from "./Equipe_Jogador";
import { Partida } from "./Partida";
import { Falta } from "./Falta";
import { Cartao } from "./Cartao";


@Entity("arbitro")

export class Arbitro{


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

    @Column({type: 'text', nullable:true })
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

    @ManyToMany(()=>Partida,partida => partida.arbitro)
    partida:Partida[]

    @OneToMany(()=> Falta, (falta) => falta.arbitro)
    falta: Falta[]

    @OneToMany(()=> Arbitro, (arbitro) => arbitro.arbitroCartao)
    arbitroCartao: Arbitro[]

}