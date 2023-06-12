import {Server} from "httptree";
import { sessionList } from "../service/session/sessionList";
import { thisProgramPath } from "../const";
import { admin_pw } from "./pw_ex.json"


export const loginServer = new Server<string>(
    undefined,
    {payloadMaxSize:1024*1024} // 1MB 입력 재한
)

const $auth = loginServer.p('a').p('auth')
$auth.p('login').get((q,s,_)=>s.sendFile(`${thisProgramPath}/public/login/login.html`))
$auth.p('sha256.js').get((q,s,_)=>s.sendFile(`${thisProgramPath}/public/login/sha256.js`))
$auth.p('login').post(async (req,res, sessionKey)=>{
    // 존재하는지 확인
    // 존재하면 세션 추가
    const reqdata = req.body('json')
    if (checkLogin(reqdata.id, reqdata.pw)){
        res.send({login:true})
    }else{
        res.statusCode = 403
        res.send({login:false})
    }

    // 로그인 체크 및 유저 할당.
    function checkLogin(id:any, pw:any){
        if(id == 'login' && pw == admin_pw /* ex: 'e7bc3ce02b93fc8da3d3d946dd751429aafecbd75f1224ab639e3669deae74c'*/) {
            // 유저 정보 할당.
            sessionList.setUser(sessionKey, 1)
            return true
        }
        else return false
    }
});

$auth.p('logout').post(async (req,res, sessionKey)=>{
    sessionList.setUser(sessionKey, null)
})