import { Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Equipe_Tecnico } from "./Equipe_Tecnico";
import { Equipe } from "./Equipe";
import { StatusTorneio,TipoTorneio } from "../Utils/enums/enums";
import { Partida } from "./Partida";

  

@Entity("torneio")

export class Torneio{


    @PrimaryGeneratedColumn("uuid")
    id: string

    @Column({type:'timestamp',nullable:true})
    createAt : Date;

    @Column({type:'timestamp',nullable:true})
    updateAt : Date;

    @Column({type:'bool',nullable:false})
    isDeleted : Boolean

    @Column({type: 'text',nullable: false})
    name: string

    @Column({ type: "enum", enum: StatusTorneio, default: StatusTorneio.NAO_INICIADO })
    status: StatusTorneio;

    @Column({ type: "enum", enum: TipoTorneio, default: TipoTorneio.MATA_MATA })
    tipo: TipoTorneio;

    @Column({ type: "text", nullable: true })
    foto: string;

    @Column({ type: "text", nullable: false })
    edicao: string;

   
       @ManyToMany(()=>Equipe,equipe => equipe.torneios)
       @JoinTable({
           name:'equipe_torneio',
           joinColumn:{
               name:'torneioId',
               referencedColumnName:'id'  
           },
           inverseJoinColumn:{
               name:'equipeId',
               referencedColumnName:'id'
           }
       })
       equipes:Equipe[]

       @OneToMany(()=>Partida,partida=>partida.torneio)
       partida: Partida[]
}


