import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Equipe_Jogador } from "./Equipe_Jogador";
import { Partida } from "./Partida";
import { Jogador } from "./Jogador";
import { Arbitro } from "./Arbitro";
import { Equipe } from "./Equipe";
import { TipoFalta } from "../Utils/enums/enums";


  



@Entity("falta")

export class Falta {

    @PrimaryGeneratedColumn("uuid")
    id: string

    @Column({ type: 'timestamp', nullable: true })
    createAt: Date;

    @Column({ type: 'timestamp', nullable: true })
    updateAt: Date;

    @Column({ type: 'bool', nullable: false })
    isDeleted: Boolean

    

    @Column({ type: "enum", enum: TipoFalta})
    tipo: TipoFalta;

    
    @Column({ type: "time", nullable: false })
    tempo: string;

    @Column({ type: 'json', nullable: true })
    posicaoCampo: { x: number; y: number } | null;

    @Column({ type: 'integer', nullable: false })
    periodo: number;
   
    @ManyToOne(() => Jogador, (jogador) => jogador.jogadorAutor)
    jogadorAutor: Jogador

    @ManyToOne(() => Jogador, (jogador) => jogador.jogadorSofreu)
    jogadorSofreu: Jogador

    @ManyToOne(() => Partida, (partida) => partida.falta)
    partida: Partida

    @ManyToOne(() => Arbitro, (arbitro) => arbitro.falta)
    arbitro: Arbitro

    @ManyToOne(() => Equipe, (equipe) => equipe.falta)
    equipe: Equipe
    

}



