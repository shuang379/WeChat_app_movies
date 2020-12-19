const DB = require('../utils/db.js')

module.exports = {
  add: async ctx => {
    let userid = ctx.state.$wxInfo.userinfo.openId
    let comment_id = +ctx.request.body.comment_id

    await DB.query('INSERT INTO archive(userid, comment_id) VALUES(?, ?)', [userid, comment_id])
  },

  list: async ctx => {
    let userid = ctx.state.$wxInfo.userinfo.openId
    ctx.state.data = await DB.query("SELECT DISTINCT m.title, m.image, t.username, t.avatar, t.content, t.movie_id, t.id AS comment_id FROM (SELECT a.userid, c.username, c.avatar, c.content, c.movie_id, c.id FROM comment c JOIN archive a ON c.id = a.comment_id) AS t JOIN movies m ON t.movie_id = m.id WHERE t.userid = ?", [userid])
  }
}