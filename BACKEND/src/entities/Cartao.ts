import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Equipe_Jogador } from "./Equipe_Jogador";
import { Partida } from "./Partida";
import { Jogador } from "./Jogador";
import { Arbitro } from "./Arbitro";
import { Equipe } from "./Equipe";
import { TipoCartao } from "../Utils/enums/enums";






@Entity("cartao")

export class Cartao {

    @PrimaryGeneratedColumn("uuid")
    id: string

    @Column({ type: 'timestamp', nullable: true })
    createAt: Date;

    @Column({ type: 'timestamp', nullable: true })
    updateAt: Date;

    @Column({ type: 'bool', nullable: false })
    isDeleted: Boolean



    @Column({ type: "enum", enum: TipoCartao })
    tipo: TipoCartao;

    @Column({ type: 'integer', nullable: false })
    periodo: number;

    @Column({ type: "time", nullable: false })
    tempo: string;

  

    @Column({ type: 'varchar', nullable: true })
    descricao: string



    @ManyToOne(() => Jogador, (jogador) => jogador.jogadorCartao)
    jogador: Jogador


    @ManyToOne(() => Partida, (partida) => partida.partidaCartao)
    partida: Partida

    @ManyToOne(() => Arbitro, (arbitro) => arbitro.arbitroCartao)
    arbitro: Arbitro

    @ManyToOne(() => Equipe, (equipe) => equipe.cartao)
    equipe: Equipe


}



