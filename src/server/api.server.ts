import { Server } from "httptree";
import { thisProgramPath } from "../const";
import { getChannelList } from "../service/api/channelList";
import { dataSource } from "../db";
import { Article } from "../db/entity/article";
import * as setup from '../setup.json'
const pageSize = setup.server.pageSize

export const apiServer = new Server<undefined>()
const articleRepository = dataSource.getRepository(Article)

const $api = apiServer.p('api')
const $article = $api.p('article')


// apiServer.catch((q,s,_)=>{
//     console.log('catch error:', );
//     s.send('error')
// })

$article.get(async (q,s,_)=>{
    const ud = x=>x==undefined?"":x
    // console.log('querystring', q.body('querystring'), q.rawBody, q.urlParms.page)
    const pageId = Number(ud(q.urlParms?.page)) // 빈 문자열도 ok
    if (Number.isNaN(pageId) || (pageId != (pageId|0)) || pageId<0){
        s.statusCode=404
        return s.send({error:"not allowed pageId"});
    }


    const list = await articleRepository.createQueryBuilder('article')
  .select('article')
  .addSelect(['channel.title', 'channel.id', 'channel.thumbnail'])
  .leftJoin('article.channel', 'channel')
  .orderBy('article.published', 'DESC')
  .skip((pageId) * pageSize) // 건너뛸 아이템 수 계산
  .take(pageSize)
  .getMany();

    s.send(list);
})

// http://localhost:8002/api/article/channel/1
$article.p('channel').p(/^\d+$/gi).get(async (q,s,_)=>{
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