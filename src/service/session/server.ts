import {addon} from "httptree"
import { IncomingMessage, ServerResponse } from "http";
import {sessionList} from "./sessionList"



export const sessionParser = async (req:IncomingMessage,res:ServerResponse)=>{
    const cookie = addon.parseCookie(req.headers['cookie'])
    const sessionRawData = cookie['session']?cookie['session']:''

    
    const trackData = {IP:req.socket.remoteAddress, userAgent:req.headers["user-agent"], date:new Date()}
    // console.log('sessionRawData',sessionRawData, trackData)
    const newSessionOrId = sessionList.existOrNew(sessionRawData, trackData);

    if (typeof(newSessionOrId)=='string'){
        res.setHeader('Set-Cookie', [`session=${newSessionOrId}; Max-Age=${sessionList.maxAge}; SameSite=Strict; HttpOnly; `])
        return {userId: null, session: newSessionOrId}
    }else{
        return {userId: newSessionOrId, session: sessionRawData}
    }
}