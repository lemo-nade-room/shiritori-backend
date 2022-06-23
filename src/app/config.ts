import * as L from 'https://github.com/lemo-nade-room/Lapor/raw/main/lapor.ts'
import routes from "./routes.ts"

const configure = (app: L.Application): void => {
    app.directory.meta = import.meta
    app.directory.publicDirectory = '../../public/'
    console.log(app.directory.publicDirectory)
    routes(app)
}

export default configure