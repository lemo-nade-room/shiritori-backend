export class RoomRecord {

    public constructor(
        public readonly playerName: string,
        private readonly text: string,
        private readonly shoutAt: Date,
    ) {}

    public readonly json = (): object => {
        return {
            name: this.playerName,
            text: this.text,
            shoutAt: this.shoutAtToString()
        }
    }

    public get time(): number {
        return this.shoutAt.getTime()
    }

    public readonly shoutAtToJSON = (): string => this.shoutAt.toJSON()

    public readonly isOut = (before: RoomRecord): boolean => {
        if (this.charAt(-1) === 'ん') return true
        if (before.charAt(-1) !== this.charAt(0)) return true
        if (this.time - before.time > 30000) return true
        return false
    }

    public readonly isText = (text: string) => this.text === text

    private readonly charAt = (index: number): string => {
        const i = index < 0 ? this.text.length + index : index
        return this.text.charAt(i)
    }

    private readonly shoutAtToString = (): string => {
        const hour = this.shoutAt.getHours()
        const minutes = this.shoutAt.getMinutes()
        const seconds = this.shoutAt.getSeconds()
        return `${hour}:${minutes}:${seconds}`
    }

}