import {createHash} from 'crypto';
const SHA256 = (txt:string)=> createHash('sha256').update(txt).digest('base64url'); // 너무 긴가? md5만 할까?

interface TrackData{
    IP: string|undefined,
    userAgent: string|undefined,
    date: Date
}
type userID = null|number

class Session{
    private sessionKey: string
    private expiration: Date
    public userId: userID
    public trackData: TrackData

    constructor(expirationSec:number, trackData:TrackData){
        this.sessionKey = this.generate()
        this.expiration = new Date(Date.now() + 1000*expirationSec)
        this.userId = null
        this.trackData = trackData
    }

    get key(){
        return this.sessionKey
    }

    private generate():string{
        return SHA256('salt'+Math.random()+Number(new Date()))
    }

    get expired():boolean{
        return (new Date())>this.expiration
    }


}

class SessionList{
    private dict: {[key:string]:Session}
    public maxAge: number

    constructor(){
        this.dict = {}
        this.maxAge = 3600*2
        setInterval(this.garbageCollection, 1000*86400)
    }

    private add(trackData:TrackData):string{
        const newSession = new Session(this.maxAge, trackData)
        this.dict[newSession.key]= newSession
        return newSession.key
    }

    private get(sessionKey):Session{
        const tmp = this.dict[sessionKey]
        if (!tmp) throw("정의되지 않은 세션")
        if (tmp.expired) throw("만료된 세션")
        return tmp
    }

    public setUser(sessionKey:string, userId: userID){
        this.get(sessionKey).userId = userId
    }

    public getUser(sessionKey:string): userID{
        return this.get(sessionKey).userId
    }


    private garbageCollection(){
        for(const key in this.dict){
            if (this.dict[key].expired) delete this.dict[key];
        }
    }

    /**
     * 세션 키를 한번에 관리하는 함수이다.
     * @param sessionKey 세션 키 정보. 없으면 빈 공백
     * @param trackData 유저 로그인 정보 관련
     * @returns 유효한 값이라면 userID를, 아니라면 새로운 세션키를 리턴한다.
     */
    existOrNew(sessionKey:string, trackData:TrackData):string|userID{
        const tmp = this.dict[sessionKey]
        
        if (!tmp || tmp.expired || tmp.trackData.userAgent != trackData.userAgent){
            return this.add(trackData) // 새 세션을 만든다.
        }else{
            tmp.trackData = trackData
            return tmp.userId
        }
    }
}




export const sessionList = new SessionList()