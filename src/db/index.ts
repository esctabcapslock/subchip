import "reflect-metadata"
import { DataSource } from "typeorm"
export const dataSource = new DataSource({
    type: "sqlite",
    database: "./database.sqlite",
    synchronize: true,
    logging: false,
    entities: [
        __dirname + "/entity/*.ts",
        __dirname + "/entity/*.js",
    ],
    // migrations: [],
    // subscribers: [],
})

/**
 * db 로딩이 끝났음을 알려주는 객체이다.
 */
export const endDbLoading = new Promise<null>((resolve=>{
    dataSource.initialize().then(dataSource=>{
        console.log('databace loaded!')
        resolve(null)
    })
}))


