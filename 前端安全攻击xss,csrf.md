### 攻击xss,csrf
#### 1. csrf攻击
在其他域名下访问被攻击者之前访问域名下的接口，通过img标签的形式，向同一个服务器发送请求，从而形成攻击。    
例如：A用户访问B（域名：http://www.b.com） 网站，登录成功以后cookie信息已经获取到，B网站发送了一个请求 http://www.b.com/list/delete?id=“11” 这样会删除了id为11的信息。如果攻击者此时利用C页面(http:www.c.com)放了一个img标签，且src=‘http://www.b.com/list/delete?id=“12”’ 这样就会向后端发起删除id为12的信息，起到攻击的作用。 因为C页面也携带了合法的cookie信息，服务器没有识别是攻击者。
会携带cookie的原因，网上说是向那个设置了cookie的服务器发请求，浏览器都会默认带上cookie，待验证。。  

#### 2. xss攻击（跨站脚本攻击），利用注入脚本攻击

这种防范可以利用http请求头里面refer字段

未完。
