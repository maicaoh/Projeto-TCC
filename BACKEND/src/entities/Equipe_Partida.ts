import { Column, Entity, ManyToOne, PrimaryColumn } from "typeorm";
import { Equipe } from "./Equipe";
import { Coach } from "./Coach";
import { Partida } from "./Partida";
import { Torneio } from "./Torneio";


@Entity('equipe_partida')
export class Equipe_Partida {


    @PrimaryColumn()
    partidaId: string;

    @PrimaryColumn()
    casaId: string;

    @PrimaryColumn()
    visitanteId: string;



    @ManyToOne(() => Partida, (partida) => partida.equipePartida, { onDelete: "CASCADE" })
    partida: Partida;

    @ManyToOne(() => Equipe, (equipe) => equipe.equipeCasa, { onDelete: "CASCADE" })
    casa: Equipe;


    @ManyToOne(() => Equipe, (equipe) => equipe.equipeVisitante, { onDelete: "CASCADE" })
    visitante: Equipe;



    


}