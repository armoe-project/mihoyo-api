import cryptoUtil from '../util/crypto-util'
import axios from 'axios'
import Koa from 'koa'

export default async (ctx: Koa.Context) => {
  let query: any = {}
  if (ctx.method === 'GET') {
    query = ctx.query
  } else if (ctx.method === 'POST') {
    query = ctx.request.body
  }
}
