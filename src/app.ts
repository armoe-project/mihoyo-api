import Koa from 'koa'
import Logger from 'koa-logger'
import Moment from 'moment'
import bodyParser from 'koa-bodyparser'
import Router from './route/router'
import GlobalVar from './data/global-var'
import OtherUtil from './util/other-util'
import chalk from 'chalk'

GlobalVar.runtime = OtherUtil.getTimeStamp(false)

const app = new Koa()
const logger = Logger((str) => {
  console.log(
    `[${chalk.hex('#0088FF').bold(Moment().format('YYYY/MM/DD HH:mm:ss'))}]` +
      str
  )
})

app.use(logger)
app.use(bodyParser())
app.use(Router)

let port = 3000

if (process.env.PORT) {
  port = Number(process.env.PORT)
}

app.listen(port)
console.log('service started on: http://localhost:' + port + '/\n')
