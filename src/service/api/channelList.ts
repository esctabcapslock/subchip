import {dataSource} from '../../db'
import { Article } from '../../db/entity/article'
import { Channel } from '../../db/entity/channel'
import { User } from '../../db/entity/user'
import { autoSelectRssParser } from '../rss/implement/list'
import { YoutubeRSS } from '../rss/implement/youtube'
import { updateCntPerDay, MinimumUpdateInterval } from './set.json'

const userRepository = dataSource.getRepository(User)
const channelRepository = dataSource.getRepository(Channel)
const articleRepository = dataSource.getRepository(Article)



const delay = (time:number)=>new Promise<void>(r=>setTimeout(r, time));

export async function getChannelList () {
    // 전체 체널 목록을 가저온다.

    const list = await channelRepository.find();
    return list;
}

async function updateArticle(articles:Article[], channel:Channel) {
    await Promise.all(articles.map(async at=>{
            at.channel = channel
            await articleRepository.save(at)
        }
    ))
}


// 체널을 업데이트한다.
export async function updateChannelAll() {
    console.log('[updateChannelAll]')
    
    // 크롤링 알고리즘 만들기.
    // 같은 도메인: 한번에 한 도메인씩만, 각 요청마다 5초 간격.
    // 다른 도메인: 동시에 보내
    const hostNameQueue:{[key:string]:Channel[]} = {}
    let hostNaleList:string[] = []
    const list = await channelRepository.find();

    for (const ch of list){
        const u  = (new URL(ch.rssURL)).hostname
        if (!hostNameQueue[u]) {hostNameQueue[u] = []; hostNaleList.push(u)}
        hostNameQueue[u].push(ch)
    }

    // console.log(`[list]`,list)
    // console.log(`[hostNaleList]`,hostNaleList)
    // hostNaleList=hostNaleList.filter(v=>v!='www.youtube.com')

    await Promise.all(hostNaleList.map(async host=>{
        const c = autoSelectRssParser(host);
        for (const ch of hostNameQueue[host]){
            const cc = new c(ch.title, new URL(ch.url), new URL(ch.rssURL));
            
            if ((Math.abs(Number(new Date(ch.lastFetched))-Date.now())<1000*60*MinimumUpdateInterval) && ch.lastFetchState=='200'){
                console.log(`Channel "\x1b[3m\x1b[32m${ch.title}\x1b[0m" was already updated \x1b[33m${((Math.abs(Number(new Date(ch.lastFetched))-Date.now())/1000/60))|0}\x1b[0m minutes ago.`)
                continue
            }
            try{
                const articles = await cc.pull()
                await updateArticle(articles, ch)
                ch.lastFetchState = '200'
                ch.lastFetched = new Date()
                channelRepository.save(ch)
            }catch(err){
                console.log(err)
                return false;

                ch.lastFetchState = err.toString()
                ch.lastFetched = new Date()
                channelRepository.save(ch)
            }finally{
                await delay(3000+Math.random()*2000);
            }
        }
    }))
}


// type testg ={언론사Id:number, 언론사제목:string, 기사ID:number, 기사제목:string, 시간:DateString, tag:String }[]

let a:NodeJS.Timer|null = null;
/**
 * 주기적으로 체널을 업데이트 하는 함수다.
 */
export async function updateCannelRegurally() {
    const SecOfDay = 1000*3600*24

    setTimeout(()=>{
        a = setInterval(()=>{
            updateChannelAll();
        }, SecOfDay/updateCntPerDay|0)
    }, (SecOfDay - (Number(new Date())%SecOfDay))%(SecOfDay/updateCntPerDay|0))
}