import { IsEmail } from "class-validator";
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, ManyToMany, JoinTable, BaseEntity, OneToMany, Index } from "typeorm"
import { Article } from "./article";
import { Channel } from "./channel";
import { User } from "./user";

@Entity()
@Index(['channel', 'user'])
export class Sublist{
    @PrimaryGeneratedColumn()
    id: number

    // @Column()
    @ManyToOne(()=> User, user=>user.sublist)
    user: User

    // 사용자 지정 테그. 1개까지? 아님 쉼표로 구분? 걍 후자하고 클라에서 찾도록 하자.
    @Column({nullable: true})
    tag: string|null;

    // 사용자 지정 이름
    @Column({nullable: true})
    title: string|null;

    @Column({default:false})
    hide: Boolean = false;

    @ManyToOne(()=>Channel, channel=>channel.sublists)
    channel: Channel;

    // @Index(['channel', 'user'], {unique:true})
    // uniqueChannelUser: [Channel, User]
}

