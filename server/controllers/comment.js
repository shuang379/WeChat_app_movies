const DB = require('../utils/db.js')

module.exports = {
  add: async ctx => {
    let userid = ctx.state.$wxInfo.userinfo.openId
    let username = ctx.state.$wxInfo.userinfo.nickName
    let avatar = ctx.state.$wxInfo.userinfo.avatarUrl
    let movie_id = +ctx.request.body.movie_id
    let content = ctx.request.body.content || null
    let comment_type = +ctx.request.body.comment_type
    let audio_duration = +ctx.request.body.audio_duration

    await DB.query('INSERT INTO comment(userid, username, avatar, content, movie_id, comment_type, audio_duration) VALUES(?, ?, ?, ?, ?, ?, ?)', [userid, username, avatar, content, movie_id, comment_type, audio_duration])
    ctx.state.data = {}
  },

  list: async ctx => {
    let movieID = + ctx.params.id

    if (!isNaN(movieID)) {
      ctx.state.data = await DB.query('SELECT * FROM comment WHERE comment.movie_id = ?', [movieID])
    } else {
      ctx.state.data = {}
    }
  },

  check: async ctx => {
    let movieID = + ctx.params.id
    let userID = ctx.state.$wxInfo.userinfo.openId

    if (!isNaN(movieID)) {
      ctx.state.data = await DB.query('SELECT c.id AS comment_id, c.username, c.avatar, c.content AS comment_content, c.movie_id, c.comment_type, c.audio_duration, m.title, m.image FROM comment c JOIN movies m ON c.movie_id = m.id WHERE c.movie_id = ? AND c.userid = ?', [movieID, userID])
    } else {
      ctx.state.data = {}
    }
  },

  mine: async ctx => {
    let userID = ctx.state.$wxInfo.userinfo.openId

    ctx.state.data = await DB.query('SELECT c.id AS comment_id, c.username, c.avatar, c.content AS comment_content, c.movie_id, m.title, m.image FROM comment c JOIN movies m ON c.movie_id = m.id WHERE c.userid = ?', [userID])
  }
}