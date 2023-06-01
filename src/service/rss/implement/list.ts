import { CommonBlogRss } from "./commonBlog";
import { YoutubeRSS } from "./youtube";

const RssImplementList = [CommonBlogRss, YoutubeRSS]
export function autoSelectRssParser(host:string){
    for(const cR of RssImplementList) if (cR.allowHost.includes(host)) return cR
    for(const cR of RssImplementList) if (cR.allowHost.includes('')) return cR
    
    throw ("해당되는 파서가 없음")
}