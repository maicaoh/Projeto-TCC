import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Equipe } from "./Equipe";
import { Jogador } from "./Jogador";

@Entity('equipe_jogador')
export class Equipe_Jogador {

  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  jogadorId: string;

  @Column()
  equipeId: string;

  @ManyToOne(() => Jogador, jogador => jogador.equipeJogador, { onDelete: "CASCADE" })
  @JoinColumn({ name: "jogadorId" })
  jogador: Jogador;

  @ManyToOne(() => Equipe, equipe => equipe.equipeJogador, { onDelete: "CASCADE" })
  @JoinColumn({ name: "equipeId" })
  equipe: Equipe;

  @Column({ type: 'timestamp', nullable: true })
  data_contratacao: Date;

  @Column({ type: 'timestamp', nullable: true })
  data_desligamento: Date | null;

  @Column({ type: "int", nullable: true })
  dorsal: number | null;

  @Column({ type: "boolean", nullable: true })
  capitao: boolean | null;


}
