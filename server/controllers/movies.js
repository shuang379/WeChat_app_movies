const DB = require('../utils/db.js')
module.exports = {
  list: async ctx => {
    ctx.state.data = await DB.query("SELECT * FROM movies;")
  },
  detail: async ctx => {
    movieID = + ctx.params.id

    if (!isNaN(movieID)) {
      ctx.state.data = await DB.query('SELECT * FROM movies WHERE movies.id = ?', [movieID])
    } else {
      ctx.state.data = {}
    }
  }
}