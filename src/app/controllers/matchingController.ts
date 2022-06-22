import * as L from '../../../../../Lapor/lapor.ts'
import { MatchingUsers } from "../models/matching/MatchingUsers.ts"
import { MatchingUser } from "../models/matching/MatchingUser.ts"


export class MatchingController implements L.RouteCollection {

    private users: MatchingUsers = new MatchingUsers([])

    public readonly boot = (routes: L.RoutesBuilder): void => {
        const home = routes.grouped('matching')
        home.get(this.index)
        home.post(this.offer)
        home.delete(':id', this.cancel)
        home.webSocket(this.onUpgrade)
    }

    private readonly index = async (req: L.Request): Promise<L.Response> => {
        // return { users: [
        //         {id: 'afe', name: 'こんにちは'},
        //         {id: 'ww', name: 'こんばんは'},
        //         {id: 'dw', name: 'おはよう'},
        //     ]}
        console.log('get headers', req.denoRequest.headers)
        console.log(this.users.all())
        return { users: this.users.all() }
    }

    private readonly offer = async (req: L.Request): Promise<L.Response> => {
        const offeredUserId = req.content.id as string
        const fromId = req.sessions.data['uuid']
        this.users.offer(fromId, offeredUserId)
        return L.HttpStatus.ok
    }

    private readonly cancel = async (req: L.Request): Promise<L.Response> => {
        const canceledId = req.parameters.get('id')
        const fromId = req.sessions.data['uuid']
        this.users.cancel(fromId, canceledId)
        return L.HttpStatus.ok
    }

    private readonly onUpgrade = async (req: L.Request, ws: L.WebSocket): Promise<void> => {
        console.log('headers', req.denoRequest.headers)
        const newUser = this.newUser(req, ws)
        req.sessions.data['uuid'] = ws.id
        this.users = this.users.inned(newUser)

        ws.onText(this.onText)

        ws.onClose(this.onClose(ws))
    }

    private readonly newUser = (req: L.Request, ws: L.WebSocket): MatchingUser => {
        console.log('session', req.sessions.data)
        return new MatchingUser(req.sessions.data['username'], ws)
    }

    private readonly onClose = (ws: L.WebSocket): () => Promise<void> => {
        return async () => {
            this.users = this.users.outed(ws)
        }
    }

    private readonly onText = async (ws: L.WebSocket, text: string): Promise<void> => {
        const json: { id: string, reply: 'accept' | 'deny' } = JSON.parse(text)
        this.users.replied(json.id, json.reply)
    }
}