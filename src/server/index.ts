import {createServer} from 'http'
import {Server} from 'httptree'
import { port } from '../const';
import { staticServer } from './static.server';
import { apiServer } from './api.server';
import { sessionParser } from '../service/session/server';
import { loginServer } from './login.server';



export const server  =  createServer(async (req,res)=>{
    
    console.log(`[${req.method}]`,'[url]', req.url,'|')

    let {userId, session} = await (async ()=>{
        try{return await sessionParser(req,res);}
        catch(e){console.log('eee',e);return {userId:undefined, session:null, keyHint: null} }
    })();

    // console.table({userId, session})
    
    if (await loginServer.parse(req,res, session)) return;
    if (userId!==(userId|0)) {res.statusCode=303; res.setHeader('location','/a/auth/login'); res.end(''); return}
    
    if (await staticServer.parse(req,res, userId)) return;
    if (await apiServer.parse(req,res, userId)) return;

    console.log('해당되는 경우가 읎다.')

    res.statusCode = 404
    res.end('not found')

}).listen(port, ()=>console.log(`this server is running at http://localhost:${port}`))

