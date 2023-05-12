import { endDbLoading } from "../../db";
import { addChannel } from "./insert";


async function test(){

    await endDbLoading;
    
    addChannel(
        "잇섭",
        "잇섭",
        new URL("https://www.youtube.com/@ITSUB"),
        new URL("https://www.youtube.com/feeds/videos.xml?channel_id=UCdUcjkyZtf-1WJyPPiETF1g")
    );
}