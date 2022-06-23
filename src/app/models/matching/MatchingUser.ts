import * as L from 'https://github.com/lemo-nade-room/Lapor/raw/main/lapor.ts'

export class MatchingUser {

    public constructor(
        public readonly username: string,
        private readonly ws: L.WebSocket
    ) {}

    public readonly send = (text: string) => this.ws.send(text)

    public get uuid(): string {
        return this.ws.id
    }

    public readonly object = (): { username: string, ws: string } => {
        return { username: this.username, ws: this.ws.id }
    }
}