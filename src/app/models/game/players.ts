import { Player } from "./player.ts"

export class Players {

    private readonly players: readonly Player[]

    public constructor(
        players: readonly Player[]
    ) {
        this.players = players
            .slice()
            .sort((a, b) => a.id.localeCompare(b.id))
    }

    public readonly added = (player: Player): Players => {
        return new Players(this.players.concat([player]))
    }

    public readonly outed = (outer: Player): Players => {
        return new Players(this.players.filter(player => player.id !== outer.id))
    }

    public readonly notify = (room: string): void => {
        this.players
            .filter(player => player.room === room)
            .forEach(player => player.sendUpdate())
    }

    public readonly find = (id: string): Player | undefined => this.players.find(player => player.id === id)

    public readonly roomPlayers = (room: string): Players => {
        return new Players(this.players.filter(player => player.room === room))
    }

    public readonly nextPlayerName = (lastPlayerName: string): string => {
        if (this.players.length === 0) return ""
        return this.nextPlayer(lastPlayerName).name
    }

    public readonly nextPlayer = (lastPlayerName: string): Player => {
        const index = this.players.map(player => player.name).indexOf(lastPlayerName)
        if (index === -1) return this.players[0]
        if (index === this.players.length - 1) return this.players[0]
        return this.players[index + 1]
    }
}