import * as L from 'https://github.com/lemo-nade-room/Lapor/raw/main/lapor.ts'
import { LoginController } from "./controllers/loginController.ts"
const routes = (app: L.Application): void => {

    app.grouped('**').grouped(new L.FileMiddleware(app.directory.publicDirectory)).get((_req) => new Promise(_resolve => {}))

    const api = app.grouped('api')
    api.register(new LoginController())
}

export default routes