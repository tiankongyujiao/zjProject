本文只是关于vue项目中使用到的nginx介绍。    
nginx在vue中的主要功能一个是把打包后的vue文件放到服务器访问，一个是使用nginx的反向代理解决跨域问题。   
### 1. 部署vue打包后的文件，重命名为hello文件夹，放到nginx的根目录，配置如下：
#### hash路由配置
```
server {
        listen       8888;
        server_name  localhost;

        location /hello {
            root D:/download/Nginx/nginx-1.17.1/nginx-1.17.1;
			      index  index.html index.htm;
        }

        error_page   500 502 503 504  /50x.html;
        location = /50x.html {
            root   html;
        }
    }

```
这种情况是vue的路由为hash，即带#的那种。    
#### 如果路由模式是history，需要特别处理一下：
(1) 第一是要把vue.config.js里面加个publicPath，改为'/hello/'
```
const vueConfig = {
    publicPath: '/hello/' // 这里
}
module.exports = vueConfig
```
(2) router的部分，创建路由实例时，要把base改为：'/hello/'
```
const router = new VueRouter({
  mode: 'history',
  base: '/hello/', // 这里
  routes
})
```
(3) nginx配置部分：
```
server {
        listen       8888;
        server_name  localhost;

        location /hello {
            root D:/download/Nginx/nginx-1.17.1/nginx-1.17.1;
	    	index  index.html index.htm; // 设置网站的默认首页
            try_files $uri $uri/ /hello/index.html; // 解析url，解析不到最后会跳到 /hello/index.html上，
            // try_files会一次匹配后面的项，比如访问localhost:8083/hello/aa，会先找localhost:8083/hello/aa，
            // 找不到在找localhost:8083/hello/aa/,最后找到localhost:8083/hello/index.html,防止页面404
        }

        error_page   500 502 503 504  /50x.html;
        location = /50x.html {
            root   html;
        }
    }
```
这样即可正常访问。
> 但是要注意，如果不把vue.config.js的publicPath和创建路由的时候特殊配置base改回来，本地再次npm run serve后的访问地址就要加上/hello路径，如： http://localhost:8080/hello    

以上是history模式配置在nginx子目录下的配置，如果是在根目录，则不需要配置vue.config.js的publicPath和创建路由的时候特殊配置base，nginx的type_files也是不需要的。   



> 如果在css或者.vue单文件组件中使用public下面的图片，前面要手动加上/hello/。

### 2. nginx反向代理解决跨域问题
正向代理代理的是客户端，比如翻墙的时候；反向代理代理的是服务端，反向代理只是一种说法，因为代理客户端被称为正向代理，所以代理服务器被称为反向代理。
```
upstream local_server{
    server 127.0.0.1:8080; // npm run serve 起来的项目地址
}
upstream datashow_server{
    server 192.168.1.121:8098; // 接口的远程服务器
} 
server {
        listen       8888;
        server_name  localhost;

        location / {
            proxy_pass http://local_server; // 访问localhost:8888实际访问的是本地起起来的项目127.0.0.1:8080
	    proxy_set_header Host $host;

        }

        location /dev-api { // 遇到/dev-api开头的接口，转向192.168.1.121:8098服务器，从192.168.1.121:8098服务器向192.168.1.121:8098发送请求，从而解决跨域
		proxy_pass http://datashow_server;
		proxy_set_header Host $host;
	}

        error_page   500 502 503 504  /50x.html;
        location = /50x.html {
            root   html;
        }
}
```
nginx解决跨域问题的思路是，把本地本来跨域的远程服务器接口写成本地相对路径的接口，访问的是本地接口，本地不存在这种接口，会通过nginx转发到远程服务器，去远程服务器请求数据，这样就是服务器和服务器之间的通信，不存在跨域问题了。
