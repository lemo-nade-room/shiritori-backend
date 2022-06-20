export class User {
    public constructor(
        public readonly name: string
    ) {}

    public static decode = (content: Record<string | number | symbol, unknown>): User => {
        if (!('username' in content)) throw new Error('property usernameがありません')
        if (typeof content.username !== 'string') throw Error('property usernameがstringではありません')
        if (content.username === '') throw Error('usernameが空です')
        return new User(content.username)
    }

}