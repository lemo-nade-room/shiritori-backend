import * as L from 'https://github.com/lemo-nade-room/Lapor/raw/main/lapor.ts'
import { LoginController } from "./controllers/loginController.ts"
import { AuthMiddleware } from "./middlewares/authMiddleware.ts"
import { MatchingController } from "./controllers/matchingController.ts"
import { RegisterController } from "./controllers/registerController.ts"
import { GameController } from "./controllers/gameController.ts"
import { MemoryRoomRecordRepository } from "./repositories/inmemory/memoryRoomRecordRepository.ts"

const routes = (app: L.Application): void => {

    const fileResponse = async (filename: string, type: string) => new Response(await Deno.readTextFile(app.directory.publicDirectory + filename), { headers: {"Content-Type": `text/${type}; charset=utf-8`}})


    app.get('index.html', async () => {
        const res = await fileResponse('index.html', 'html')
        return { type: 'responsible', response: () =>  res}
    })

    app.get('favicon.ico', async () => {
        const file = await Deno.readFile(app.directory.publicDirectory + 'favicon.ico')
        return { type: 'responsible', response: () =>  new Response(file, { headers: {"Content-Type": "image/x-icon"}})}
    })

    app.get(['assets', 'index.bf3fd607.css'], async () => {
        const res = await fileResponse('assets/index.bf3fd607.css', 'css')
        return { type: 'responsible', response: () =>  res}
    })

    app.get(['assets', 'index.95151ac1.js'], async () => {
        const res = await fileResponse('assets/index.95151ac1.js', 'javascript')
        return { type: 'responsible', response: () =>  res}
    })

    app.get('**', async () => {
        const res = await fileResponse('index.html', 'html')
        return { type: 'responsible', response: () =>  res}
    })

    const api = app.grouped('api').grouped(new LogMiddleware())
    api.register(new LoginController())

    const auth = api//.grouped(new AuthMiddleware())

    const roomRecordRepository = new MemoryRoomRecordRepository()
    auth.register(new MatchingController(roomRecordRepository))
    auth.register(new RegisterController())
    auth.register(new GameController(roomRecordRepository))
}

class LogMiddleware implements L.Middleware {
    public readonly respond = async (req: L.Request, next: L.HttpHandler): Promise<L.Response> => {
        console.log(req.url.pathPhrase, req.method)
        return await next(req)
    }
}
export default routes