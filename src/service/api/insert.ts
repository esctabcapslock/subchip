

import {dataSource} from '../../db'
import { Channel } from '../../db/entity/channel'
import { User } from '../../db/entity/user'

const userRepository = dataSource.getRepository(User)
const channelRepository = dataSource.getRepository(Channel)
// const user = new User()

 
async function insertTest(){
    const adminUser = await userRepository.findBy({
        id: 1
    })

}

/*@Column()
    title: string;

    @Column()
    auther: string;

    @Column()
    @IsUrl()
    url: string;

    @Column()
    @IsUrl()
    rssURL: string;*/


export async function addChannel(title :string, auther:string, url:URL, rssURL:URL){
    const ch = new Channel()
    ch.title = title
    ch.auther = auther
    ch.url = url.toString()
    ch.rssURL = rssURL.toString()
    ch.sublists = [];


    //저장하자.
    channelRepository.save(ch)
}



