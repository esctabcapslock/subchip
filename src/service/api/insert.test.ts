import { endDbLoading } from "../../db";
import { addChannel } from "./insert";


async function test(){

    await endDbLoading;
    
    // addChannel(
    //     "**",
    //     "**",
    //     new URL("https://www.youtube.com/channel/**"),
    //     new URL("https://www.youtube.com/feeds/videos.xml?channel_id=**")
    // );
}

(async ()=>{
    await endDbLoading;
    await test();
})();
