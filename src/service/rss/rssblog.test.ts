import { parseStringPromise } from "xml2js";
import { Article } from "../../db/entity/article";
import { get } from "../http";
import { CrawlingRSS } from "./crawlingRSS"
import { YoutubeRSS } from "./implement/youtube";
import * as rssdata from "./rssMyBlogData.json"
import { writeFileSync } from "fs";

const chURL = new URL('https://[##blog name##]')
const rssURL = new URL('https://[##blog name##]/feed');

async function test1(){
    const k = new YoutubeRSS("UH",chURL, rssURL)
    console.log(`[pull] data pull from host:${k.rssUrl}`)
    const xmlData = await get(k.rssUrl);
    const rssdata = await parseStringPromise(xmlData)
    console.log(rssdata)
    writeFileSync('rssMyBlogData2.json',JSON.stringify(rssdata));
}

async function test2(){
    const entry = rssdata.feed.entry
    if(!Array.isArray(entry)) throw("배열 아님")
    return entry.map(articleData=>{
        const article = new Article()


        function summary(inputStr, maxLang=240){
            let out = ''
          for(const k of inputStr.split(' ')){
            if (out.length + k.length < maxLang-1)  out+=(k+' ')
          }
            return out.trim()
        }
        
        const content =  articleData.content[0]._.replace(/\<[^>]+>/gi,'')
            .replace(/\s+/gi,' ')
            .replace(/&nbsp;/gi,' ')
            .replace(/&rdquo;/gi,'”')
            .replace(/&prime;/gi,'′')
            // .replace(/&nbsp;/gi,' ')
            // .replace(/&nbsp;/gi,' ')

        article.title = articleData.title[0]._
        article.link = articleData.link[0].$.href
        article.published = new Date(articleData.published[0])
        article.updated = new Date(articleData.updated[0])
        article.thumbnail = null
        article.summary = articleData.summary[0]._
        article.content = content
        return article
    })
}

(async ()=>{
    const k = await test1();
    console.log(k)
})();
