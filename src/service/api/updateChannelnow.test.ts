import { endDbLoading } from "../../db";
import { updateChannelAll } from "./channelList";

(async ()=>{
    await endDbLoading;
    await updateChannelAll();
})();

