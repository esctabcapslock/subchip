import { parseStringPromise } from "xml2js"
import { promisify } from "util"
import { articleData, CrawlingRSS } from "../crawlingRSS";
import { Article } from "../../../db/entity/article";

export class YoutubeRSS extends CrawlingRSS{
    static allowHost = ['youtube.com']


    async rssParser(rssXML: string){
        const rssdata = await parseStringPromise(rssXML)

        const entry = rssdata.feed.entry
        if(!Array.isArray(entry)) throw("배열 아님")
        return entry.map(articleData=>{
            // 있으면 어캄? 나중에 처리하자
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
}