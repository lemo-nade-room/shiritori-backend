import * as L from '../../../../Lapor/lapor.ts'
import routes from "./routes.ts"

const configure = (app: L.Application): void => {
    app.directory.meta = import.meta
    app.directory.publicDirectory = '../../public/'
    console.log(app.directory.publicDirectory)
    routes(app)
}

export default configure