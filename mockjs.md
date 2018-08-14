#mockjs的使用#
***
##建文件user.js存储mock到的数据##
```
  import Mock from "mockjs"
  
  const Users = [];
  for (let i=0; i<100; i++){
      Users.push(Mock.mock({
          id: Mock.Random.integer(60, 100),
          time: Mock.Random.datetime(),
          desc: Mock.Random.cparagraph()
      }))
  }
  
  const Goods = []
  for (let i=0; i<10; i++){
      Goods.push(Mock.mock({
          id: Mock.Random.integer(60, 100),
          desc: Mock.Random.cparagraph(10,20),
          img: Mock.Random.image('200x100', '#4A7BF7',i)
      }))
  }
  export { Users, Goods }
```

##建立index.js,通过axios-mock-adapter生成代理api地址##
```
  var axios = require('axios')
  var MockAdapter = require('axios-mock-adapter')

  import {Users, Goods} from "./data/users"

  export default {
    init() {
        var mock = new MockAdapter(axios)
        mock.onGet('/users').reply(200, {
            code: 1001, msg: '请求成功', Users
        })
        
        mock.onGet('/goods').reply(config => {
          return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve([200, {
                    goods: Goods,
                    config: config.params
                }])
            }, 500)
          })
        })
    }
  }
```
##api.js对api的统一调用##
```
  import axios from 'axios' 
  let base = ''
  export const requestUsers = params => axios.get(`${base}/users`).then(res => res.data)
  export const requestGoods = params => { return axios.get(`${base}/goods`, { params: params }).then(res => res.data) }
```
##在main.js中对mock进行初始化##
```
import Mock from './mock'
Mock.init()
```

##最后在页面调用时##
```
requestUsers().then((res) => {
    console.log(res)
})
requestGoods({id:1}).then((res) => {
    console.log(res)
})
```
