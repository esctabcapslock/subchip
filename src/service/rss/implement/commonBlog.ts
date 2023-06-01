import { parseStringPromise } from "xml2js"
import { CrawlingRSS } from "../crawlingRSS";
import { Article } from "../../../db/entity/article";

function summary(inputStr:string, maxLang:number=240){
    let out = ''
  for(const k of inputStr.split(' ')){
    if (out.length + k.length < maxLang-1)  out+=(k+' ')
  }
    return out.trim()
}

function removeHTMLTag(inputHTML:string){
    const out = inputHTML.replace(/\<[^>]+>/gi,'')
        .replace(/\s+/gi,' ')
        .replace(/&nbsp;/gi,' ')
        .replace(/&rdquo;/gi,'”')
        .replace(/&prime;/gi,'′')
        .replace(/&hellip;/gi,'…')//
        .replace(/&bull;/gi,'•')
        .replace(/&ensp;/gi,' ')
        .replace(/&emsp;/gi,' ')
        .replace(/&thinsp;/gi,' ')
        .replace(/&ndash;/gi,'–')
        .replace(/&mdash;/gi,'—')
        .replace(/&lsquo;/gi,'‘')
        .replace(/&rsquo;/gi,'’')
        .replace(/&sbquo;/gi,'‚')
        .replace(/&ldquo;/gi,'“')
        .replace(/&bdquo;/gi,'„')
        .replace(/&dagger;/g,'†')
        .replace(/&Dagger;/g,'‡')
        .replace(/&frasl;/gi,'⁄')
        .replace(/&oline;/gi,'‾')
        .replace(/&lsaquo;/gi,'‹')
        .replace(/&rsaquo;/gi,'›')
        .replace(/&rsaquo;/gi,'›')
        .replace(/&rsaquo;/gi,'›')
        .replace(/&rsaquo;/gi,'›')
        .replace(/&rsaquo;/gi,'›')
        .replace(/&quot;/g, "\"")
        .replace(/&amp;/g, "&")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&#(\d+);/g, (match, dec) => String.fromCharCode(dec));
    return out
}

/**
 * [...temp0.getElementsByTagName('tr')].filter((v,i)=>i).map(v=>{
	d = v.getElementsByTagName('td')
	if(d[3].textContent?.trim()){
		return `.replace(/${d[3].textContent?.trim()}/g, "${d[0].textContent?.trim()}")`
}

}).filter(v=>v).join('\n')
https://www.w3schools.com/charsets/ref_utf_basic_latin.asp
 */

export class CommonBlogRss extends CrawlingRSS{
    static allowHost = ['']


    async rssParser(rssXML: string){
        console.log('rssXML:',rssXML)
        const rssdata = await parseStringPromise(rssXML)
        if (rssdata.rss && rssdata.rss?.$?.version == '2.0'){
            const entry = rssdata.rss.channel[0].item
            if(!Array.isArray(entry)) throw("배열 아님")
            return entry.map(articleData=>{
                // 있으면 어캄? 나중에 처리하자
                const article = new Article()
                
                const body =  removeHTMLTag(articleData.description[0])

                article.title = articleData.title[0]
                article.link = articleData.link[0]
                article.published = new Date(articleData.pubDate[0])
                article.updated = null
                article.thumbnail = null
                article.summary = body.length<250?body:summary(body, 250)
                article.content = body.length>250?body:null
                return article
            })
        }else if (rssdata.feed){
            const entry = rssdata.feed.entry
            if(!Array.isArray(entry)) throw("배열 아님")
            return entry.map(articleData=>{
                const article = new Article()
            
                const content =  removeHTMLTag(articleData.content[0]._);

                article.title = articleData.title[0]._
                article.link = articleData.link[0].$.href
                article.published = new Date(articleData.published[0])
                article.updated = new Date(articleData.updated[0])
                article.thumbnail = null
                article.summary = articleData.summary[0]._
                article.content = content
                return article
            })
        }else{
            throw(`알맞은 파싱 불가능, name:${this.name}, url:${this.url}`)
        }
        
        

    }
}