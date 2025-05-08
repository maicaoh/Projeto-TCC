import { Column, Entity, ManyToMany, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Coach } from "./Coach";
import { Equipe_Tecnico } from "./Equipe_Tecnico";
import { Equipe_Jogador } from "./Equipe_Jogador";
import { Torneio } from "./Torneio";
import { Equipe_Partida } from "./Equipe_Partida";
import { Gol } from "./Gol";
import { Finalizacao } from "./Finalizacao";
import { Drible } from "./Drible";
import { Desarme } from "./Desarme";
import { Falta } from "./Falta";
import { Cartao } from "./Cartao";


@Entity('equipe')
export class Equipe {

    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ type: 'timestamp', nullable: true })
    createAt: Date;

    @Column({ type: 'timestamp', nullable: true })
    updateAt: Date;

    @Column({ type: 'bool', nullable: false })
    isDeleted: Boolean

    @Column({ type: 'text', nullable: false })
    name: string

    @Column({ type: 'text', nullable: true })
    telefone: string

    //@Column({ type: 'text', nullable: false })
    //responsavel: string

    @Column({ type: 'text', nullable: true })
    endereco: string

    @Column({ type: "text", nullable: false })
    logo: string;

    @OneToMany(() => Equipe_Tecnico, equipeTecnico => equipeTecnico.equipe)
    equipeTecnico: Equipe_Tecnico[]

    @OneToMany(() => Equipe_Jogador, equipeJogador => equipeJogador.equipe, { cascade: ["insert"] })
    equipeJogador: Equipe_Jogador[];
    

    @ManyToMany(() => Torneio, torneio => torneio.equipes)
    torneios: Torneio[]

    @OneToMany(() => Equipe_Partida, equipePartida => equipePartida.casaId)
    equipeCasa: Equipe_Jogador[]

    @OneToMany(() => Equipe_Partida, equipePartida => equipePartida.visitanteId)
    equipeVisitante: Equipe_Jogador[]


    @OneToMany(() => Gol, (gol) => gol.equipe)
    equipeGol: Gol[]

    @OneToMany(() => Finalizacao, (finalizacao) => finalizacao.equipe)
    equipeFinalizacao: Finalizacao[]

    @OneToMany(() => Drible, (drible) => drible.equipe)
    drible: Drible[]

    @OneToMany(() => Desarme, (desarme) => desarme.equipe)
    desarme: Desarme[]

    @OneToMany(() => Falta, (falta) => falta.equipe)
    falta: Falta[]

    @OneToMany(() => Cartao, (cartao) => cartao.equipe)
    cartao: Cartao[]





}