import { MatchingUser } from "./MatchingUser.ts"
import * as L from '../../../../../../Lapor/lapor.ts'

export class MatchingUsers {

    public constructor(
        private readonly users: readonly MatchingUser[]
    ) {}

    public readonly inned = (newUser: MatchingUser): MatchingUsers => {
        this.broadcast(JSON.stringify({ type: 'add', user: { id: newUser.uuid, name: newUser.username }}))
        return new MatchingUsers(this.users.concat([newUser]))
    }

    public readonly outed = (ws: L.WebSocket): MatchingUsers => {
        this.broadcast(JSON.stringify({ type: 'outed', id: ws.id }))
        return new MatchingUsers(
            this.users.filter(user => user.uuid !== ws.id)
        )
    }

    public readonly broadcast = (text: string): void => {
        this.users.forEach(user => {
            return user.send(text)
        })
    }

    public readonly denied = (id: string) => {
        const user = this.users.find(user => user.uuid === id)
        user?.send(JSON.stringify({ type: 'denied' }))
    }

    public readonly accepted = (id: string, wsText: string) => {
        const user = this.users.find(user => user.uuid === id)
        user?.send(wsText)
    }

    public readonly offer = (fromId: string, id: string) => {
        const offeredUser = this.users.find(user => user.uuid === id)
        offeredUser?.send(JSON.stringify({ type: 'offered', id: fromId }))
    }

    public readonly cancel = (fromId: string, id: string) => {
        const canceledUser = this.users.find(user => user.uuid === id)
        canceledUser?.send(JSON.stringify({ type: 'canceled', id: fromId }))
    }

    public readonly all = (): {id: string, name: string}[] => {
        return this.users.map(user => ({ id: user.uuid, name: user.username }))
    }
}