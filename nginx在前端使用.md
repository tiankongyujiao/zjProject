nginx主要功能一个是把打包后的vue文件放到服务器访问，一个是使用nginx的反向代理解决跨域问题。   
1. 部署vue打包后的文件，重命名为hello文件夹，放到nginx的根目录，配置如下：
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
如果路由模式是history，需要特别处理一下：
