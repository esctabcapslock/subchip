import {dataSource} from '../../db'
import { Article } from '../../db/entity/article'
import { Channel } from '../../db/entity/channel'
import { User } from '../../db/entity/user'
import { autoSelectRssParser } from '../rss/implement/list'
import { YoutubeRSS } from '../rss/implement/youtube'
import * as setup from '../../setup.json'
const {updateCntPerDay, MinimumUpdateInterval} = setup.api

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
        let u  = (new URL(ch.rssURL)).hostname
        let udot = u.split('.')
        if (udot.length>2) u = `${udot[udot.length-2]}.${udot[udot.length-1]}`
        if (!hostNameQueue[u]) {hostNameQueue[u] = []; hostNaleList.push(u)}
        hostNameQueue[u].push(ch)
    }

    // console.log(`[list]`,list)
    // console.log(`[hostNaleList]`,hostNaleList)
    // hostNaleList=hostNaleList.filter(v=>v=='avcd.kr')
    // console.log(`[hostNaleList]`,hostNaleList)
    // return

    await Promise.all(hostNaleList.map(async host=>{
        const c = autoSelectRssParser(host);
        for (const ch of hostNameQueue[host]){
            const cc = new c(ch.title, new URL(ch.url), new URL(ch.rssURL));
            
            // if (!ch.url.includes('kk')) {console.log(ch.url,'은 부적절하다.');return};
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
                ch.lastFetchState = err.toString()
                ch.lastFetched = new Date()
                channelRepository.save(ch)
            }finally{
                await delay(2000+Math.random()*1000);
            }
        }
    }))
}


/**
 * 아래와 같이 주어진 초를 시간:분:초 형식으로 반환하는 Node.js 함수를 작성할 수 있습니다.
 * @param seconds 
 * @returns 
 */
function formatTime(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    const formattedHours = String(hours).padStart(2, '0');
    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = remainingSeconds.toFixed(1).padStart(4, '0');
    const formattedTime = `${formattedHours}h ${formattedMinutes}m ${formattedSeconds}s`;
    const yellowFormattedTime = `\x1b[33m${formattedTime}\x1b[0m`;
    return yellowFormattedTime;
  }

// type testg ={언론사Id:number, 언론사제목:string, 기사ID:number, 기사제목:string, 시간:DateString, tag:String }[]

let a:NodeJS.Timer|null = null;
/**
 * 주기적으로 체널을 업데이트 하는 함수다.
 */
export async function updateCannelRegurally() {
    const SecOfDay = 1000*3600*24
    const offset = 2.5*60*1000 //정시보다 약간 늦게 크롤링. 
    const cal_remain_time = ()=>(SecOfDay - (Number(new Date())%SecOfDay)+offset)%(SecOfDay/updateCntPerDay|0)

    while (true){
        console.log(formatTime(cal_remain_time()/1000), "뒤에 업데이트가 예정되었습니다.")
        await delay (cal_remain_time());
        console.log(new Date().toLocaleTimeString('en-US', { hour12: false }),)
        await updateChannelAll()
    }
    // setTimeout(()=>{

       
    //     // a = setInterval(()=>{
    //     //     updateChannelAll();
    //     //     console.log(formatTime((SecOfDay/updateCntPerDay|0)/1000), '시간 뒤에 업데이트가 예정되었습니다.')
    //     // }, SecOfDay/updateCntPerDay|0)
    //     // console.log(formatTime((SecOfDay/updateCntPerDay|0)/1000), '시간 뒤에 업데이트가 예정되었습니다.')
    //     while (true){
    //         updateChannelAll();
    //         await delay (cal_remain_time());
    //     }
    // }, cal_remain_time())

    // console.log(formatTime(cal_remain_time()/1000), "시간 뒤에 업데이트가 예정되었습니다.")
}