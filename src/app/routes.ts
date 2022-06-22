import * as L from '../../../../Lapor/lapor.ts'
import { LoginController } from "./controllers/loginController.ts"
import { AuthMiddleware } from "./middlewares/authMiddleware.ts"
import { MatchingController } from "./controllers/matchingController.ts"
import { RegisterController } from "./controllers/registerController.ts"

const routes = (app: L.Application): void => {
    app.grouped('**')
        .grouped(new L.FileMiddleware(app.directory.publicDirectory))
        .get((_req) => new Promise(_resolve => {}))

    const api = app.grouped('api').grouped(new LogMiddleware())
    api.register(new LoginController())

    const auth = api.grouped(new AuthMiddleware())
    auth.register(new MatchingController())
    auth.register(new RegisterController())
}

class LogMiddleware implements L.Middleware {
    public readonly respond = async (req: L.Request, next: L.HttpHandler): Promise<L.Response> => {
        console.log(req.url.pathPhrase, req.method)
        return await next(req)
    }
}
export default routes