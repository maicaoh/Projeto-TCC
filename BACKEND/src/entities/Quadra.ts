import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Equipe_Jogador } from "./Equipe_Jogador";
import { Partida } from "./Partida";
import { PisoQuadra } from "../Utils/enums/enums";


@Entity("quadra")

export class Quadra {


    @PrimaryGeneratedColumn("uuid")
    id: string

    @Column({ type: 'timestamp', nullable: true })
    createAt: Date;

    @Column({ type: 'timestamp', nullable: true })
    updateAt: Date;

    @Column({ type: 'bool', nullable: false })
    isDeleted: Boolean

    @Column({ type: 'text', nullable: false })
    name: string

    @Column({ type: "decimal", precision: 6, scale: 2, nullable: false })
    comprimento: number;

    @Column({ type: "decimal", precision: 6, scale: 2, nullable: false })
    largura: number;

    
    @Column({ type: 'text', nullable: true })
    endereco: string

    @Column({ type: 'text', nullable: true })
    telefone: string

    @Column({ type: "enum", enum: PisoQuadra })
    piso: PisoQuadra;

    

    @Column({ type: 'text', nullable: true })
    responsavel: string


    @OneToMany(() => Partida, (partida) => partida.quadra)
    partida: Partida[]

}



