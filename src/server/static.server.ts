import { Server } from "httptree";
import { thisProgramPath } from "../const";

export const staticServer = new Server<undefined>()

const $s = staticServer.p('s')
staticServer.get((req,res,_)=>{
    res.sendFile(`${thisProgramPath}/public/main.html`)
})

$s.p('*').get((q,s,_)=>{
    s.sendFile(`${thisProgramPath}/public/img/${q.lastSubPath}`)
})