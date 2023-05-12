import { IsEmail } from "class-validator";
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, ManyToMany, JoinTable, BaseEntity, OneToMany } from "typeorm"
import { Article } from "./article";
import { Channel } from "./channel";
import { Sublist } from "./sublist";

@Entity()
export class User{
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    pw: string;

    @Column()
    @IsEmail()
    email: string; // TODO 유효성 검증

    @OneToMany(()=>Sublist, sublist=>sublist.user)
    sublist: Sublist[];

    // @OneToMany(()=>Channel, channel=>channel.user)
    // channels: Channel[];
}