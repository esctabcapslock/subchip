import {createServer} from 'http'
import {Server} from 'httptree'
import { port } from '../const';
import { staticServer } from './static.server';
import { apiServer } from './api.server';



export const server  =  createServer(async (req,res)=>{
    
    console.log(`[${req.method}]`,'[url]', req.url,'|')
    if (await staticServer.parse(req,res, undefined)) return;
    if (await apiServer.parse(req,res, undefined)) return;

    console.log('해당되는 경우가 읎다.')

    res.statusCode = 404
    res.end('not found')

}).listen(port, ()=>console.log(`this server is running at http://localhost:${port}`))

