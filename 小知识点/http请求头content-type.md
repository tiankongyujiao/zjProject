### 介绍
MIME媒体类型，http中使用content-type来表示媒体类型，使用content-type来告诉服务器请求消息携带的数据结构类型，好让服务端接收后以合适的方式处理。    
常见的媒体类型如下：
+ text/html: HTML格式
+ text/plain: 纯文本格式
+ text/xml: XML格式
+ image/gif: gif图片格式
+ image/jpeg: jpg图片格式
+ image/png: png图片格式

以application开头的媒体格式如下：
+ application/json: JSON数据格式
+ application/x-www-form-urlencoded ：表单默认的提交数据的格式(设置在form表单提交的enctype参数中:只能指定application/x-www-form-urlencoded和multipart/form-data这两种类型,默认是application/x-www-form-urlencoded类型，浏览器会把表单中发送的数据编码为“key=value”对的形式,当向服务器发送大量的文本、包含非ASCII字符的文本或二进制数据时，例如上传文件时，选择multipart/form-data):
```
<form action="" enctype="multipart/form-data"></form>
<form action="" enctype="application/x-www-form-urlencoded"></form>
```
+ application/pdf: pdf格式 
+ application/msword: Word文档格式
+ application/octet-stream: 二进制流数据（如常见的文件下载）
+ application/xml: XML数据格式
+ application/xhmtl+xml: XHTML格式
+ application/atom+xml：Atom XML聚合格式 

上传文件使用的媒体格式
+ multipart/form-data: 需要在表单中进行文件上传时，就需要使用该格式

**不过需要注意的是，一般get请求不需要设置Content-Type，只有post才有必要设置！**    
为什么get请求不需要设置Content-Type？    
那要从Content-Type的作用说起，Content-Type作用是为了告诉别人我携带的数据是什么格式？    
+ 对于request请求    
get是不携带数据的，url中?后的参数不算做data    
post是需要带参数的，也就是data参数，客户端告诉服务端，自己的数据类型    
+ 对于response响应    
反过来了，服务端告诉客户端，自己的数据类型，这样浏览器就知道是按text/html页面渲染，还是按照text/plain渲染。    
浏览器加载一个静态页面：
原文在返回时，在responseHeaders中设置Content-Type，其值为’text/html’：    
> response.writeHead(200, {'Content-Type': 'text/html'});
返回的是一个html页面，如果返回的值是‘text/plain’， 则返回的是：
```
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>光伏上链</title>

    <link rel="stylesheet" href="css/index.css" />
  </head>
  <body>
  </body>
</html>
```

因此Content-Typ作用是告知别人我的数据是什么格式的，可以是客户端告知服务端，可以是服务端告知客户端。  

+ 在回到之前的问题，为什么get请求不需要设置Content-Type？

原因就是get时，不会携带狭义的数据，即data，那么自然就没必要告诉服务器自己的数据类型是什么了！当然了，如果强行给get请求设置Content-Type也不会出错，但是没有意义