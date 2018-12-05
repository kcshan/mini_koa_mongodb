const Koa = require('koa'),
      path = require('path'),
      static = require('koa-static'),
      router = require('koa-router')(),
      render = require('koa-art-template'),
      BodyParser = require('koa-bodyparser'),
      DB = require('../module/db')

// 实例化
const app = new Koa()

app.use(BodyParser())

//设置静态资源的路径 
const staticPath = '../static'
 
app.use(static(
  path.join( __dirname,  staticPath)
))

render(app, {
  root: path.join(__dirname, '../views'),
  extname: '.html',
  debug: process.env.NODE_ENV == 'production'
})

router.get('/', async (ctx) => {
  var result = await DB.find('users', {})
  await ctx.render('index', {
    list: result
  })
})

router.get('/news', async (ctx) => {
  ctx.body = '这是一个新闻列表页面'
})

router.get('/edit', async (ctx) => {
  let id = ctx.query.id
  let data = await DB.find('users', {_id: DB.getObjectID(id)})
  await ctx.render('edit', {
    list: data[0]
  })
})

router.get('/add', async (ctx) => {
  await ctx.render('add')
})

router.get('/delete', async (ctx) => {
  let id = ctx.query.id
  let data = await DB.remove('users', {_id: DB.getObjectID(id)})
  try {
    if (data.result.ok) {
      ctx.redirect('/')
    }
  } catch (error) {
     ctx.redirect('/')
  }
})

router.post('/doAdd', async (ctx) => {
  let data = await DB.insert('users', ctx.request.body)
  try {
    if (data.result.ok) {
      ctx.redirect('/')
    }
  } catch (error) {
     ctx.redirect('/add')
  }
})

router.post('/doEdit', async (ctx) => {
  let id = ctx.request.body.id,
      name = ctx.request.body.name,
      age = ctx.request.body.age
      six = ctx.request.body.six
  let data = await DB.update('users', {
    '_id': DB.getObjectID(id)
  }, {
    name,
    age,
    six
  })
  try {
    if (data.result.ok) {
      ctx.redirect('/')
    }
  } catch (error) {
     ctx.redirect('/edit?id=' + id)
  }
})

app.use(router.routes()) // 启动路由
app.use(router.allowedMethods()) 

app.listen(8001)
console.log('server start at port 8001')