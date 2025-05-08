import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Equipe_Jogador } from "./Equipe_Jogador";
import { Partida } from "./Partida";
import { Jogador } from "./Jogador";
import { Equipe } from "./Equipe";
import { Finalizacao } from "./Finalizacao";


@Entity("gol")
export class Gol {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: 'timestamp', nullable: true })
  createAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  updateAt: Date;

  @Column({ type: 'bool', nullable: false })
  isDeleted: Boolean;



  @Column({ type: "time", nullable: false })
  tempoGol: string;

  @Column({ type: 'bool', nullable: false })
  golContra: Boolean;

  @Column({ type: 'integer', nullable: false })
  periodo: number;

  @Column({ type: 'json', nullable: true })
  posicaoCampo: { x: number; y: number } | null;

  @Column({ type: 'json', nullable: true })
  posicaoGol: { x: number; y: number } | null;

  @ManyToOne(() => Jogador, { nullable: true })
  assistente: Jogador | null;

  @ManyToOne(() => Jogador, (jogador) => jogador.golDefensor)
  jogadorDefensor: Jogador;

  @ManyToOne(() => Jogador, (jogador) => jogador.gols)
  jogador: Jogador;

  @ManyToOne(() => Partida, (partida) => partida.gol)
  partida: Partida;

  @ManyToOne(() => Equipe, (equipe) => equipe.equipeGol)
  equipe: Equipe;

  @OneToOne(() => Finalizacao, { cascade: true })
  @JoinColumn()
  finalizacao: Finalizacao;
}