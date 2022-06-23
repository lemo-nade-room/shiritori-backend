import * as L from '../../../../../../Lapor/lapor.ts'

export class Player {

    public constructor(
        public readonly name: string,
        private readonly ws: L.WebSocket,
        public readonly room: string,
    ) {}

    public readonly is = (player: Player) => this.name === player.name

    public get id(): string {
        return this.ws.id
    }

    public readonly sendUpdate = () => {
        this.ws.send(JSON.stringify({ type: 'update' }))
    }
}