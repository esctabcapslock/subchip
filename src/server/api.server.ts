import { Server } from "httptree";
import { thisProgramPath } from "../const";
import { getChannelList } from "../service/api/channelList";
import { dataSource } from "../db";
import { Article } from "../db/entity/article";

export const apiServer = new Server<undefined>()
const articleRepository = dataSource.getRepository(Article)

const $api = apiServer.p('api')
const $article = $api.p('article')


apiServer.catch((q,s,_)=>{
    console.log('catch error:',);
    s.send('error')
})

$article.get(async (q,s,_)=>{
    // const list = await articleRepository.find({ order: {
    //     published : 'DESC'
    //   },
    //     relations: {channel: {
            
    //     }},
    // // select: ['link', 'channel.title']
    // }


    const list = await articleRepository.createQueryBuilder('article')
  .select('article')
  .addSelect(['channel.title', 'channel.id', 'channel.thumbnail'])
  .leftJoin('article.channel', 'channel')
  .orderBy('article.published', 'DESC')
  .getMany();

    // FindOptionsRelations<Channel>;

    // const list = await articleRepository.find({
    //     order: {
    //       published: 'DESC'
    //     },
    //     relations: ['channel'],
    //     select: ['link', 'channel.title', 'channel.id']
    //   });
    s.send(list);
})

// http://localhost:8002/api/article/channel/1
$article.p('channel').p(/\d+/gi).get(async (q,s,_)=>{
    console.log('channel Id maybe??',q.lastSubPath)
    const channelId = parseInt(q.lastSubPath)
    console.log('channel Id:', channelId)

    const list = await articleRepository.createQueryBuilder('article')
    .select('article')
    .addSelect(['channel.title', 'channel.id', 'channel.thumbnail'])
    .where('channel.id = :channelId', { channelId })
    .leftJoin('article.channel', 'channel')
    .orderBy('article.published', 'DESC')
    .getMany();


    s.send(list);







})

const $tag = $article.p('tag')
$tag.get(async (q,s,_)=>{
    s.send([])
})

const $channel = $api.p('channel')
$channel.get(async (q,s,_)=>{
    const list = await getChannelList()
    s.send(list);
})