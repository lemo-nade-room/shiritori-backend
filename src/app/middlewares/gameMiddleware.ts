import * as L from 'https://github.com/lemo-nade-room/Lapor/raw/main/lapor.ts'

export class GameMiddleware implements L.Middleware {

    public readonly respond = async (req: L.Request, next: L.HttpHandler): Promise<L.Response> => {
        if (!req.sessions.data['room']) {
            throw L.Abort.unauthorized
        }
        return await next(req)
    }
}