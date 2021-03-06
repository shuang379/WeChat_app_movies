/**
 * ajax 服务路由集合
 */
const router = require('koa-router')({
    prefix: '/weapp'
})
const controllers = require('../controllers')

// 从 sdk 中取出中间件
// 这里展示如何使用 Koa 中间件完成登录态的颁发与验证
const { auth: { authorizationMiddleware, validationMiddleware } } = require('../qcloud')

// --- 登录与授权 Demo --- //
// 登录接口
router.get('/login', authorizationMiddleware, controllers.login)
// 用户信息接口（可以用来验证登录态）
router.get('/user', validationMiddleware, controllers.user)

// --- 图片上传 Demo --- //
// 图片上传接口，小程序端可以直接将 url 填入 wx.uploadFile 中
router.post('/upload', controllers.upload)

// --- 信道服务接口 Demo --- //
// GET  用来响应请求信道地址的
router.get('/tunnel', controllers.tunnel.get)
// POST 用来处理信道传递过来的消息
router.post('/tunnel', controllers.tunnel.post)

// --- 客服消息接口 Demo --- //
// GET  用来响应小程序后台配置时发送的验证请求
router.get('/message', controllers.message.get)
// POST 用来处理微信转发过来的客服消息
router.post('/message', controllers.message.post)

// 获取电影列表
router.get('/movies', controllers.movies.list)
// 获取电影详情
router.get('/movies/:id', controllers.movies.detail)
// 创建影评
router.post('/comment', validationMiddleware, controllers.comment.add)
// 获取影评列表or详情, id = movie_id
router.get('/comment/:id', controllers.comment.list)
// 判断是否已评, id = movie_id
router.get('/mycomment/:id',validationMiddleware, controllers.comment.check)
// 获取我发布的影评
router.get('/mycomment', validationMiddleware, controllers.comment.mine)
// 收藏影评
router.post('/archive', validationMiddleware, controllers.archive.add)
// 获取收藏影评列表
router.get('/archive', validationMiddleware, controllers.archive.list)

module.exports = router
