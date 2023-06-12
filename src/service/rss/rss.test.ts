import { Article } from "../../db/entity/article";
import { CrawlingRSS } from "./crawlingRSS"
import { YoutubeRSS } from "./implement/youtube";
import * as rssdata from "./rssdata.json"

const youtubeURL = new URL('https://www.youtube.com')
const rssURL = new URL('https://www.youtube.com/feeds/videos.xml?channel_id=UCdUcjkyZtf-1WJyPPiETF1g');

async function test1(){
    const k = new YoutubeRSS("잇섭",youtubeURL, rssURL)
    try{
        const kk = await k.pull()
        console.log('data:',kk)
    }catch(e){
        console.error('test중 에러,',e)
    }
}

async function test2(){
    const entry = rssdata.feed.entry
    if(!Array.isArray(entry)) throw("배열 아님")
    return entry.map(articleData=>{
        const article = new Article()
        

        article.title = articleData.title[0]
        article.link = articleData.link[0].$.href
        article.published = new Date(articleData.published[0])
        article.updated = new Date(articleData.updated[0])
        article.thumbnail = articleData["media:group"][0]["media:thumbnail"][0].$.url
        article.summary = articleData["media:group"][0]["media:description"][0]
        article.content = null
        return article
    })
}

(async ()=>{
    const k = await test1();
    console.log(k)
})();
