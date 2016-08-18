[TOC]
## IOT 环境部署   
- nodejs
1. 下载源码  [下载地址](https://nodejs.org/en/download/),本文以v0.10.24为例:
```
cd /usr/local/src/
wget http://nodejs.org/dist/v0.10.24/node-v0.10.24.tar.gz 
```
2. 解压源码   
```
    tar zxvf node-v0.10.24.tar.gz   
```
3. 编译安装
```
cd node-v0.10.24
./configure --prefix=/usr/local/node/0.10.24
make
make install
```
4. 配置 
  _进入profile编辑环境变量_
```
   vim /etc/profile
```
  _设置环境变量_
```
在 export PATH USER LOGNAME MAIL HOSTNAME HISTSIZE HISTCONTROL 一行的上面添加如下内容:
#set for nodejs
export NODE_HOME=/usr/local/node/0.10.24
export PATH=$NODE_HOME/bin:$PATH
```
  _保存退出_
```  
  :wq  
```
  _编译/etc/profile使配置生效_  
```
  source /etc/profile  
```
5. 验证
  node -v  输出 v0.10.24 表示配置成功

- mongodb
1. 下载源码 [下载地址](http://www.mongodb.org/downloads),下载并解压 tgz（以下演示的是 64 位 Linux上的安装）
```
# 下载
curl -O https://fastdl.mongodb.org/linux/mongodb-linux-x86_64-3.0.6.tgz    
# 解压
tar -zxvf mongodb-linux-x86_64-3.0.6.tgz            
# 将解压包拷贝到指定目录                       
mv  mongodb-linux-x86_64-3.0.6/ /usr/local/mongodb                        
```
2. 配置 (步骤参上)
```
#<mongodb-install-directory> 为MongoDB 的安装路径。如本文的 /usr/local/mongodb
export PATH=<mongodb-install-directory>/bin:$PATH
```
3. 创建数据库目录 
```
#<data-directory>为数据库目录,该目录需要创建
mkdir -p <data-directory>
```
4. 启动服务
_命令行启动_
```
#/data/db 是 MongoDB 默认的启动的数据库路径,若数据库目录不是它,可以通过 --dbpath 来指定,其中<data-directory>为数据库目录
./mongod --dbpath <data-directory>
```
5. 后台管理 mongo
```
#进入mongoDB后台后，它默认会链接到 test 文档（数据库）
$ ./mongo
```

- mosquitto  
1. 下载源码 [下载地址](http://mosquitto.org/download/),并解压
2. 安装
_源码目录里面找到主要的配置文件config.mk_
```
# 是否支持tcpd/libwrap功能.
#WITH_WRAP:=yes

# 是否开启SSL/TLS支持
#WITH_TLS:=yes

# 是否开启TLS/PSK支持
#WITH_TLS_PSK:=yes

# Comment out to disable client client threading support.
#WITH_THREADING:=yes

# 是否使用严格的协议版本（老版本兼容会有点问题）
#WITH_STRICT_PROTOCOL:=yes

# 是否开启桥接模式
#WITH_BRIDGE:=yes

# 是否开启持久化功能
#WITH_PERSISTENCE:=yes

# 是否监控运行状态
#WITH_MEMORY_TRACKING:=yes
```
注意的是，默认情况下Mosquitto的安装需要OpenSSL的支持；如果不需要SSL，则需要关闭config.mk里面的某些与SSL功能有关的选项（WITH_TLS、WITH_TLS_PSK
_命令行_ 
```
make install
```
4. 配置  安装完成之后，所有配置文件会被放置于/etc/mosquitto/,其中最重要的就是Mosquitto的配置文件，即mosquitto.conf
5. 运行
```
mosquitto -c /etc/mosquitto/mosquitto.conf -d 
```

## 视图工具rockmongo
- PHP 运行环境
- 开发开发套件  
yum install -y openssl-devel  
yum install -y php-devel  
yum install -y php-pear  
- php mongo插件  
安装  
```
   $ sudo pecl install mongo  
```
配置文件php.ini 添加
```
   extension=mongo.so  
```
[帮助文档](http://php.net/manual/en/mongo.installation.php#mongo.installation.nix)

## 项目依赖
- dependencies 正常运行该包时所需要的依赖项
1. express 框架,如下是其中间件
     - body-parser 
     用于解析客户端请求的body中的内容
     - cookie-parser 
     用于获取web浏览器发送的cookie中的内容
     - debug 
     记录路由匹配、使用到的中间件、应用模式以及请求-响应循环 
     - jade 
     模板引擎
     - morgan
     记录日志 
     - serve-favicon
     用于请求网页的logo
2. mongoose
    MongoDB nodejs驱动
3. mqtt
    mqtt
4. mqtt-router
    mqtt路由
5. uuid
    用户生成uuid
6. async
    异步流程控制,用于解决nodejs嵌套
7. crypto-js
    加密库
- devDependencies 开发的时候需要的依赖项，像一些进行单元测试之类的包
1. mocha
    自动化测试工具
2. supertest
    express 网络请求模块测试
3. querystring
    用于实现URL参数字符串与参数对象的互相转换
4. istanbul
    测试率覆盖工具
5. should
    断言库

## 项目依赖
###  dependencies   
正常运行该包时所需要的依赖项    

1. express 框架,如下是其中间件      
     - body-parser  
     用于解析客户端请求的body中的内容   
     - cookie-parser   
     用于获取web浏览器发送的cookie中的内容   
     - debug     
     记录路由匹配、使用到的中间件、应用模式以及请求-响应循环     
     - jade     
     模板引擎    
     - morgan    
     记录日志     
     - serve-favicon    
     用于请求网页的logo    
2. mongoose  
    MongoDB nodejs驱动
3. mqtt
    mqtt
4. mqtt-router
    mqtt路由
5. uuid
    用户生成uuid
6. async
    异步流程控制,用于解决nodejs嵌套
7. crypto-js
    加密库
### devDependencies 
开发的时候需要的依赖项，像一些进行单元测试之类的包  
   
1. mocha  
    自动化测试工具
2. supertest
    express 网络请求模块测试
3. querystring
    用于实现URL参数字符串与参数对象的互相转换
4. istanbul
    测试率覆盖工具
5. should  
    断言库

## 运行
- 启动 采用forever模块启动  
```
#安装 
$ sudo npm install forever -g   
#启动 
$ forever start www.js  
#关闭         
$ forever stop www.js     
#输出日志和错误       
$ forever start -l forever.log -o out.log -e err.log www.js   
```
- 单元测试
```
npm test
```
## 数据功能模块
- app端
1. 注册用户(测试用户)   
    account:13812341234  
    password:1234  
2. 设备注册 
    app端负责中转,参见接口文档  **局域网设备发现协议**   
- 设备端
1. 设备数据上传 
    提供demo示例



