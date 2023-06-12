
import { IsUrl } from "class-validator";
import { channel } from "diagnostics_channel"
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, ManyToMany, JoinTable, BaseEntity, OneToMany, PrimaryColumn } from "typeorm"
import { Channel } from "./channel"
@Entity()
export class Article{
    // @PrimaryGeneratedColumn()
    // id: number

    @PrimaryColumn()
    @IsUrl()
    link: string; // 이거 유일해야함

    @ManyToOne(()=> Channel, channel=>channel.articles)
    channel: Channel

    @Column()
    title: string;

    // @Column()
    

    @Column()
    published: Date;

    @Column({nullable: true})
    updated: Date|null;

    @Column({nullable: true})
    summary: string|null

    @Column({nullable: true})
    content?: string|null

    @Column({nullable:true})
    @IsUrl()
    thumbnail: string|null
    
}