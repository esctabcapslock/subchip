import { rejects } from "assert"
import * as http from "http"
import * as https from "https"
import { resolve } from "path"
import { promisify } from "util"
import { userAgent } from "./set.json"
const http_get = promisify(http.get)
const https_get = promisify(https.get)

export async function get(url: URL): Promise<string> {
    return new Promise(async (resolve, rejects)=>{
        console.log('get',String(url))
        if(!['http:', 'https:'].includes(url.protocol)) return rejects("유효하지 않는 주소")
        const getFn = url.protocol == 'http:' ? http.get : https.get
        
        const req = getFn({
            hostname: url.host,
            path: url.pathname+url.search,
            headers:{
                userAgent,
            },
        }, res=>{
            let data = Buffer.from([])
            res.on('data',chunk=>{
                data = Buffer.concat([data, chunk])
            })
            res.on("error",e=>{
                console.log('error res:',e)
                rejects(e)
            })

            res.on('end',async ()=>{
                // console.log('data:',data)
                if(!res.statusCode) return resolve(`잘못된 statusCode : ${res.statusCode}`)
                if ((res.statusCode/100|0)==2) resolve(data.toString())
                if ((res.statusCode/100|0)==3 && res.headers.location) {
                    try{
                        return resolve(await get(new URL(res.headers.location)));
                    }catch(e){
                        console.log(e)
                        return rejects(`잘못된 statusCode : ${res.statusCode}, -> 에러남: error:${e}`)
                    }
                }
                else rejects(`잘못된 statusCode : ${res.statusCode}, location 없음`)
            })
        })

        req.on("error",e=>{
            console.log('error/req:',e)
            rejects(e)
        })

        req.end()
        
    })

}