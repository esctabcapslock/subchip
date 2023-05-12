import { get } from ".";

(async ()=>{
    const url = new URL("http://localhost")
    try{
        const res = await get(url);
        console.log('[http.get test] res', res)
    }catch(e){
        console.log('error oqard')
    }
    
})();