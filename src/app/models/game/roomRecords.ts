import { RoomRecord } from "./roomRecord.ts"
import { Players } from "./players.ts"

export class RoomRecords {

    public constructor(
        private readonly records: readonly RoomRecord[],
    ) {
        if (records.length === 0) {
            throw new Error('初期値なしのルーム')
        }
    }

    public readonly json = (players: Players): Record<string, unknown> => {
        return {
            records: this.records
                .slice()
                .sort((a, b) => a.time - b.time)
                .map(record => record.json()),
            lastDate: this.lastDate(),
            nextPlayer: players.nextPlayerName(this.lastPlayerName()),
            judged: this.judged(),
            winner: this.winner()
        }
    }

    private readonly lastPlayerName = (): string => {
        return this.latestRecord().playerName
    }

    private readonly lastDate = (): string => {
        return this.latestRecord().shoutAtToJSON()
    }

    public readonly isLastText = (text: string): boolean => {
        return this.latestRecord().isText(text)
    }

    public readonly latestRecord = (): RoomRecord => this.atLast()

    private readonly atLast = (index: number = 1) => this.records[this.records.length - index]

    public readonly judged = (): boolean => {
        if (this.records.length === 1) return false
        if (this.duplicateText()) return true
        return this.latestRecord().isOut(this.atLast(2))
    }

    private readonly duplicateText = (): boolean => {
        return this.records
            .slice(0, this.records.length - 1)
            .some(record => record.isText(this.latestRecord().text))
    }

    public readonly winner = (): string => {
        if (!this.judged()) return ''
        const winner = this.atLast(2).playerName
        return winner === '初期値' ? '一人負け' : winner
    }
}