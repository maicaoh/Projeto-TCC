import { Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Equipe_Jogador } from "./Equipe_Jogador";
import { Equipe_Partida } from "./Equipe_Partida";
import { Arbitro } from "./Arbitro";
import { Quadra } from "./Quadra";
import { Gol } from "./Gol";
import { Finalizacao } from "./Finalizacao";
import { Drible } from "./Drible";
import { Desarme } from "./Desarme";
import { Falta } from "./Falta";
import { Cartao } from "./Cartao";
import { Torneio } from "./Torneio";
import { StatusPartida } from "../Utils/enums/enums";


@Entity("partida")

export class Partida {


    @PrimaryGeneratedColumn("uuid")
    id: string

    @Column({ type: 'timestamp', nullable: true })
    createAt: Date;

    @Column({ type: 'timestamp', nullable: true })
    updateAt: Date;

    @Column({ type: 'bool', nullable: false })
    isDeleted: Boolean

    @Column({ type: 'integer', nullable: true })
    publicoPresente: number

    @OneToMany(() => Equipe_Partida, equipePartida => equipePartida.partida)
    equipePartida: Equipe_Partida[]

    @Column({ type: "enum", enum: StatusPartida, default: StatusPartida.NAO_INICIADO})
    status: StatusPartida;


    @ManyToMany(() => Arbitro, arbitro => arbitro.partida)
    @JoinTable({
        name: 'partida_arbitro',
        joinColumn: {
            name: 'partidaId',
            referencedColumnName: 'id'
        },
        inverseJoinColumn: {
            name: 'arbitroId',
            referencedColumnName: 'id'
        }
    })
    arbitro: Arbitro[]

    @ManyToOne(() => Quadra, (quadra) => quadra.partida)
    quadra: Quadra

    @OneToMany(()=>Gol,(gol)=>gol.partida)
    gol:Gol[]

    
    @OneToMany(()=>Finalizacao,(finalizacao)=>finalizacao.partida)
    finalizacao:Finalizacao[]

        
    @OneToMany(()=>Drible,(drible)=>drible.partida)
    drible:Drible[]

    @OneToMany(()=>Desarme,(desarme)=>desarme.partida)
    desarme:Desarme[]

    @OneToMany(()=>Falta,(falta)=>falta.partida)
    falta:Falta[]

    @OneToMany(()=>Cartao,(cartao)=>cartao.partida)
    partidaCartao:Cartao[]

    @ManyToOne(()=> Torneio, torneio => torneio.partida)
    torneio: Torneio

    @Column({ type: 'timestamp', nullable: true })
    data: Date ;

    @Column({ type: 'integer', nullable: true })
    rodada: number

}

