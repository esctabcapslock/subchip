import { Server } from "httptree";
import { thisProgramPath } from "../const";

export const staticServer = new Server<number>()

const $s = staticServer.p('s')
staticServer.get((req,res,_)=>{
    res.sendFile(`${thisProgramPath}/public/main.html`)
})

$s.p('img').p('*').get((q,s,_)=>{
    console.log('[sendfile/img',`${thisProgramPath}/public/img/${q.lastSubPath}`)
    s.sendFile(`${thisProgramPath}/public/img/${q.lastSubPath}`)
})