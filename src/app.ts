import { dataSource, endDbLoading } from "./db";
import { User } from "./db/entity/user";

dataSource;

// (async ()=>{
//     await endDbLoading;

//     const user = dataSource.getRepository(User)
//     const newUser= new User()
//     newUser.email = 'admin@ew'
//     newUser.pw = 'password'
//     user.save(newUser)
// })();