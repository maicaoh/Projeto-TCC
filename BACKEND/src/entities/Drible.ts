import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Equipe_Jogador } from "./Equipe_Jogador";
import { Partida } from "./Partida";
import { Jogador } from "./Jogador";
import { Equipe } from "./Equipe";
import { Pe } from "../Utils/enums/enums";






@Entity("drible")

export class Drible {

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

    @Column({ type: 'bool', nullable: false })
    desarme: Boolean

    @Column({ type: 'json', nullable: true })
    posicaoCampo: { x: number; y: number } | null;

    @Column({ type: "enum", enum: Pe })
    pe: Pe;

    @Column({ type: 'integer', nullable: false })
    periodo: number;


    @Column({ type: "time", nullable: false })
    tempo: string;

    @ManyToOne(() => Jogador, (jogador) => jogador.jogadorDrible)
    jogadorAtacante: Jogador

    @ManyToOne(() => Jogador, (jogador) => jogador.jogadorDefensorDrible)
    jogadorDefensor: Jogador

    @ManyToOne(() => Partida, (partida) => partida.drible)
    partida: Partida

    @ManyToOne(() => Equipe, (equipe) => equipe.drible)
    equipe: Equipe

}



