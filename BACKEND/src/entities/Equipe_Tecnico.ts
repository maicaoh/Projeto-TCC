import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { Equipe } from "./Equipe";
import { Coach } from "./Coach";


@Entity('equipe_tecnico')
export class Equipe_Tecnico {


      @PrimaryGeneratedColumn("uuid")
      id: string;

    @Column()
    equipeId: number;

    @Column()
    coachId: number;

    @ManyToOne(() => Coach, (coach) => coach.equipeTecnico, { onDelete: "CASCADE" })
    @JoinColumn({ name: "coachId" })
    coach: Coach;

    @ManyToOne(() => Equipe, (equipe) => equipe.equipeTecnico, { onDelete: "CASCADE" })
    @JoinColumn({ name: "equipeId" })
    equipe: Equipe;

    @Column({ type: 'timestamp', nullable: true })
    data_contratacao: Date;

    @Column({ type: 'timestamp', nullable: true })
    data_desligamento: Date | null;



}