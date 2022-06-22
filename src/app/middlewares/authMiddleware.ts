import * as L from '../../../../../Lapor/lapor.ts'


export class AuthMiddleware implements L.Middleware {

    public readonly respond = async (req: L.Request, next: L.HttpHandler): Promise<L.Response> => {
        console.log('middleware', req.sessions.data['username'])
        if (!req.sessions.data['username']) {
            console.log(Date.now(), 'auth failed', req.sessions.data['username'])
            throw L.Abort.unauthorized
        }
        console.log(Date.now(), 'auth clear')
        return await next(req)
    }
}