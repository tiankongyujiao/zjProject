### 使用https
格式：https://github.com/tiankongyujiao/zjProject.git    
使用https clone的时候没有问题，但是最后push的时候报504 time out错误

### 使用ssh
格式：git@github.com:tiankongyujiao/zjProject.git    
使用ssh的方式要先生成密钥并配置到github上面    
##### 生成密钥方法：
+ 1. 首先本地安装好git；
+ 2. 桌面右键 Git Bash Here 打开git命令行；
+ 3. ssh-keygen -t rsa -C "nideyouxiang@xxx.com" （全部按enter，后面为github所填邮箱）；
+ 4. cd ~/.ssh （如果没有执行第三步，则不会有这个文件夹；一般在此处能找到该文件C:\Users\zhaojiao\.ssh\id_rsa.pub）；
##### 配置到github上面去：
+ 5. cat id_rsa.pub 在命令行打开这个文件，会直接输出密钥；(cat代表打开这个文件)
+ 6. 复制该密钥，打开github ，点自己头像 >> settings >> SSH and GPG keys >>New SSH key
+ 7. titile（可随便填写，例如SSHkey）；key里粘贴第六步的内容，完成密钥配置

##### 这样配置好了以后就可以使用git常规的操作命令来提交文件了
+ git add . 添加所有文件
+ git commit -m '注释'
+ git push 推送到远程github仓库