import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Equipe_Jogador } from "./Equipe_Jogador";
import { Gol } from "./Gol";
import { Finalizacao } from "./Finalizacao";
import { Drible } from "./Drible";
import { Desarme } from "./Desarme";
import { Falta } from "./Falta";
import { Cartao } from "./Cartao";


@Entity("jogador")

export class Jogador{


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



    @Column({ type: "smallint", default: 1, nullable: false }) // 1 = Direito, 0 = Esquerdo
    peDominante: number;
    

    @Column({type: 'text', nullable:true })
    apelido: string  
    
    @Column({type:'timestamp',nullable:false})
    dataNascimento : Date;

    @Column({ type: "smallint", default: 4, nullable: false })
    posicao: number

    @Column({ type: "text", nullable: true })
    foto: string;

    @Column({ type: "decimal", precision: 3, scale: 2, nullable:false  }) // Exemplo: 1.89
    altura: number;


    @Column({type: 'varchar', length: 11, nullable: true })
    cpf: string

    @Column({type: 'text',nullable: true})
    telefone: string

    @Column({type: 'text',nullable: true})
    cidadeNatal: string
  

    @OneToMany(()=>Equipe_Jogador,equipeJogador => equipeJogador.jogador)
    equipeJogador:Equipe_Jogador[]

    @OneToMany(()=> Gol , (gol) => gol.jogador)
    gols: Gol[]

    @OneToMany(()=> Gol , (gol) => gol.jogadorDefensor)
    golDefensor: Gol[]

    @OneToMany(()=> Finalizacao , (finalizacao) => finalizacao.jogadorAtacante)
    jogadorFinalizador: Finalizacao[]

    @OneToMany(()=> Finalizacao , (finalizacao) => finalizacao.jogadorDefensor)
    jogadorDefensor: Finalizacao[]

    @OneToMany(()=> Drible , (drible) => drible.jogadorAtacante)
    jogadorDrible: Drible[]

    @OneToMany(()=> Drible , (drible) => drible.jogadorDefensor)
    jogadorDefensorDrible: Drible[]

    @OneToMany(()=> Desarme , (desarme) => desarme.jogadorDesarme)
    jogadorDesarme: Desarme[]

    @OneToMany(()=> Desarme , (desarme) => desarme.jogadorDesarmado)
    jogadorDesarmado: Desarme[]

    @OneToMany(()=> Falta, (falta) => falta.jogadorAutor)
    jogadorAutor: Falta[]

    @OneToMany(()=> Falta, (falta) => falta.jogadorSofreu)
    jogadorSofreu: Falta[]

    @OneToMany(()=> Cartao, (cartao) => cartao.jogador)
    jogadorCartao: Cartao[]



}



