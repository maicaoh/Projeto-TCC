import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Equipe_Jogador } from "./Equipe_Jogador";
import { Partida } from "./Partida";
import { Jogador } from "./Jogador";
import { Equipe } from "./Equipe";
import { Pe } from "../Utils/enums/enums";






@Entity("desarme")

export class Desarme {

    @PrimaryGeneratedColumn("uuid")
    id: string

    @Column({ type: 'timestamp', nullable: true })
    createAt: Date;

    @Column({ type: 'timestamp', nullable: true })
    updateAt: Date;

    @Column({ type: 'bool', nullable: false })
    isDeleted: Boolean

    @Column({ type: 'bool', nullable: false })
    sucesso: Boolean

    @Column({ type: "enum", enum: Pe })
    pe: Pe;

    @Column({ type: 'json', nullable: true })
    posicaoCampo: { x: number; y: number } | null;

    @Column({ type: 'integer', nullable: false })
    periodo: number;


    @Column({ type: "time", nullable: false })
    tempo: string;


    @ManyToOne(() => Jogador, (jogador) => jogador.jogadorDesarme)
    jogadorDesarme: Jogador

    @ManyToOne(() => Jogador, (jogador) => jogador.jogadorDesarmado)
    jogadorDesarmado: Jogador

    @ManyToOne(() => Partida, (partida) => partida.desarme)
    partida: Partida

    @ManyToOne(() => Equipe, (equipe) => equipe.desarme)
    equipe: Equipe

}



