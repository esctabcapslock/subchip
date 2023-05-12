import { Article } from "../../db/entity/article";
import { get } from "../http";

export abstract class CrawlingRSS{
    public name: string;
    public url: URL;
    public rssUrl: URL;
    public articleData: Article[];
    abstract allowHost: string[]
    constructor(name: string, url:URL, rssUrl:URL){
        this.name  = name
        this.url = url
        this.rssUrl = rssUrl
        this.articleData = []
    }

    /**
     * 사이트마다 재각각인 규격을 표준화하는 함수
     * @param rssXML XML 데이터를 입력을 받는다.
     */
    abstract rssParser(rssXML:string): Promise<Article[]>

    /**
     * 사이트에서 현재 정보를 가져오는 함수
     */
    async pull(): Promise<Article[]>{
        const xmlData = await get(this.rssUrl);
        this.articleData = await this.rssParser(xmlData)
        return this.articleData
    }
}

// type rssParserFn = (rssXML:string)=>articleData

export class articleData{

}