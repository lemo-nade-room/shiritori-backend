import * as L from '../../../../../Lapor/lapor.ts'
import { RoomRecordRepository } from "../repositories/roomRecordRepository.ts"
import { Players } from "../models/game/players.ts"
import { Player } from "../models/game/player.ts"
import { GameMiddleware } from "../middlewares/gameMiddleware.ts"


export class GameController implements L.RouteCollection {

    private players: Players = new Players([])

    public constructor(
        private readonly recordRepository: RoomRecordRepository,
    ) {}

    public readonly boot = (routes: L.RoutesBuilder): void => {
        const game = routes.grouped('game').grouped(new GameMiddleware())
        game.webSocket(this.onUpgrade)
        game.get(this.index)
        game.post(this.shout)
    }

    private readonly index = async (req: L.Request): Promise<L.Response> => {
        const roomId = req.sessions.data['room']
        const records = this.recordRepository.fetch(roomId)

        // データベースを使用していないので1時間後に削除するようにしておく
        if (records.judged()) setTimeout(() => this.recordRepository.remove(roomId), 60 * 60 * 1000)

        return records.json(this.players.roomPlayers(roomId))
    }

    private readonly shout = async (req: L.Request): Promise<L.Response> => {
        if (!('text' in req.content && typeof req.content.text === 'string')) throw L.Abort.badRequest

        const roomId = req.sessions.data['room']
        const username = req.sessions.data['username']
        const text = req.content.text

        this.recordRepository.add(roomId, username, text)
        this.players.notify(roomId)

        const records = this.recordRepository.fetch(roomId)
        if (records.judged()) return L.HttpStatus.ok

        setTimeout(() => {
            if (!this.recordRepository.fetch(roomId).isLastText(text)) return
            this.recordRepository.add(roomId, '審判', 'タイムオーバー')
            this.players.notify(roomId)
        }, 31 * 1000)

        return L.HttpStatus.ok
    }

    private readonly onUpgrade = async (req: L.Request, ws: L.WebSocket): Promise<void> => {
        req.sessions.data['uuid'] = ws.id
        const room = req.sessions.data['room']
        const player = new Player(req.sessions.data['username'], ws, room)
        this.players = this.players.added(player)

        this.players.notify(room)

        ws.onClose(async () => {
            const player = this.players.find(ws.id)
            if (!player) return
            this.players = this.players.outed(player)
            this.players.notify(player.room)
        })
    }
}