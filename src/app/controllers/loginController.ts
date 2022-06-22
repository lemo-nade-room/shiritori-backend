import * as L from '../../../../../Lapor/lapor.ts'
import { User } from "../models/user.ts"

export class LoginController implements L.RouteCollection {

    public readonly boot = (routes: L.RoutesBuilder): void => {
        const login = routes.grouped('login')
        login.get(this.index)
        login.post(this.login)
    }

    private readonly index = async (req: L.Request) => {
        const username = req.sessions.data['username']
        if (!username) throw L.Abort.unauthorized
        return username
    }

    private readonly login = async (req: L.Request): Promise<L.Response> => {
        const user = User.decode(req.content)
        req.sessions.data['username'] = user.name
        return L.HttpStatus.ok
    }

}