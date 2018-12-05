class Db {
  static getInstance () {
    if (!Db.instance) {
      Db.instance = new Db()
    }
    return Db.instance
  }
  constructor() {
    console.log('实例化触发构造函数')
    this.connect()
  }
  connect () {
    console.log('连接数据库')
  }
  find () {
    console.log('查询数据库')
  }
}

const myDb = Db.getInstance() 
const myDb2 = Db.getInstance() 

myDb.connect()
myDb2.connect()