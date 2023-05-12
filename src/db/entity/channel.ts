import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, ManyToMany, JoinTable, BaseEntity, OneToMany } from "typeorm"
import { Article } from "./article";
import { User } from "./user";
import { IsUrl } from 'class-validator';
import { Sublist } from "./sublist";
@Entity()
export class Channel{
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    title: string;

    @Column()
    auther: string;

    @Column()
    @IsUrl()
    url: string;

    @Column()
    @IsUrl()
    rssURL: string;

    @OneToMany(()=>Article, article=>article.channel)
    articles: Article[];

    // @Column({default:false})
    // hide: Boolean = false;

    @OneToMany(()=> Sublist, sublist=>sublist.channel)
    sublists: Sublist[]
    //sublist=>sublist.user

}
