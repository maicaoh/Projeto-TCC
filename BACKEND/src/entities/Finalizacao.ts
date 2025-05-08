import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Equipe_Jogador } from "./Equipe_Jogador";
import { Partida } from "./Partida";
import { Jogador } from "./Jogador";
import { Equipe } from "./Equipe";
import { Pe } from "../Utils/enums/enums";
import { Gol } from "./Gol";

@Entity("finalizacao")

export class Finalizacao {


    @PrimaryGeneratedColumn("uuid")
    id: string

    @Column({ type: 'timestamp', nullable: true })
    createAt: Date;

    @Column({ type: 'timestamp', nullable: true })
    updateAt: Date;

    @Column({ type: 'bool', nullable: false })
    isDeleted: Boolean

    @Column({ type: 'bool', nullable: false })
    defesa: Boolean
    
    @Column({ type: 'bool', nullable: false })
    bloqueio: Boolean

        
    @Column({ type: 'bool', nullable: false })
    falta: Boolean

    @Column({ type: 'bool', nullable: false })
    gol: Boolean


    @Column({ type: 'bool', nullable: false })
    seteMetros: Boolean

    @Column({ type: 'bool', nullable: false })
    penalti: Boolean

    @Column({ type: "enum", enum: Pe})
    pe: Pe;

    @Column({ type: 'integer', nullable: false })
    periodo: number;

    @Column({ type: 'json', nullable: true })
    posicaoCampo: { x: number; y: number } | null;

    @Column({ type: 'json', nullable: true })
    posicaoGol: { x: number; y: number } | null;

    @Column({ type: "time", nullable: false })
    tempo: string;


    @ManyToOne(() => Jogador, (jogador) => jogador.jogadorFinalizador)
    jogadorAtacante: Jogador

    @ManyToOne(() => Jogador, (jogador) => jogador.jogadorDefensor)
    jogadorDefensor: Jogador

    @ManyToOne(() => Partida, (partida) => partida.finalizacao)
    partida: Partida

     @ManyToOne(() => Equipe, (equipe) => equipe.equipeFinalizacao)
    equipe: Equipe


}






