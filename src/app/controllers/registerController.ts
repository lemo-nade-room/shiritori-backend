import * as L from 'https://github.com/lemo-nade-room/Lapor/raw/main/lapor.ts'

export class RegisterController implements L.RouteCollection {

    public readonly boot = (routes: L.RoutesBuilder): void => {
        routes.post(["register", ":room"], this.register)
    }

    private readonly register = async (req: L.Request): Promise<L.Response> => {
        req.sessions.data['room'] = req.parameters.get('room')
        console.log('room', req.sessions.data['room'])
        return L.HttpStatus.ok
    }
}