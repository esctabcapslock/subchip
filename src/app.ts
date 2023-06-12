import { dataSource, endDbLoading } from "./db";
import { User } from "./db/entity/user";
import { server } from "./server";
import { updateCannelRegurally } from "./service/api/channelList";

dataSource;
server;
updateCannelRegurally();

// (async ()=>{
//     await endDbLoading;

//     const user = dataSource.getRepository(User)
//     const newUser= new User()
//     newUser.email = 'admin@ew'
//     newUser.pw = 'password'
//     user.save(newUser)
// })();