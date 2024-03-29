### 前端鉴权cookie，session，token.md
#### 1. cookie
> cookie是后端存放在前端的，前端请求接口时会自动带上cookie
#### 2. session
> session是基于cookie实现的，也是存储在cookie里面的，只不过存取的是一个标识，不是原始信息，session的具体消息是保存在服务端的，服务端存在本地或者redis中。 
```
const http = require('http')
const session = {}
http.createServer((req, res) => {
    const sessionKey = 'sid'

    if (req.url === '/favicon.ico') {
        return
    } else {
        const cookie = req.headers.cookie
        if (cookie && cookie.indexOf(sessionKey) > -1) {
            res.end('Come Back')
            const pattern = new RegExp(`${sessionKey}=([^;]+);?\s*`)
            const sid = pattern.exec(cookie)[1]
            console.log('session:', sid, session, session[sid])
        } else {
            const sid = (Math.random() * 9999999).toFixed()
            res.setHeader('Set-Cookie', `${sessionKey}=${sid}`)
            session[sid] = { name: 'laowang' } // 存储在本地
            res.end('hello cookie')
        }
    }

}).listen(3000)
```
session的流程：
1. 服务器在接受客户端首次访问时在服务器端创建seesion，然后保存seesion(我们可以将seesion保存在内存中，也可以保存在redis中，推荐使用后者)，然后给这个session生成一个唯一的标识字符串,然后在响应头中种下这个唯一标识字符串。
2. 签名。这一步通过秘钥对sid进行签名处理，避免客户端修改sid。（非必需步骤）
3. 浏览器中收到请求响应的时候会解析响应头，然后将sid保存在本地cookie中，浏览器在下次http请求的请求头中会带上该域名下的cookie信息，
4. 服务器在接受客户端请求时会去解析请求头cookie中的sid，然后根据这个sid去找服务器端保存的该客户端的session，然后判断该请求是否合法。
#### 3. token
> token的出现是因为cookie的局限性:    
> (1) 不是所有的终端都有cookie的，比如APP    
> (2)session的不足：要求服务端有状态，就是用户的状态要保存在服务端。    
> jwt实现的token不需要把状态保存在服务端，token的组成分为三部分：①令牌头(加密方法，加密算法) @payload载荷（即用户名密码这些信息） ③hash（对前两部分的组合加密），服务端不需要存储token，只要根据token的三部分解析token是否正确和过期即可。

token的流程：
 1. 客户端使用用户名跟密码请求登录。
 2. 服务端收到请求，去验证用户名与密码。
 3. 验证成功后，服务端会签发一个令牌(Token)，再把这个 Token 发送给客户端。
 4. 客户端收到 Token 以后可以把它存储起来，比如放在 Cookie 里或者 Local Storage 里。
 5. 客户端每次向服务端请求资源的时候需要带着服务端签发的 Token。
 6. 服务端收到请求，然后去验证客户端请求里面带着的 Token，如果验证成功，就向客户端返回请求的数据。
