# iFilmo-Chat
ifilmo chat room

### 安装rabbitmq

#### 使用brew安装

```shell
brew update
```
```shell
brew install rabbitmq
```

#### 配置环境变量

`.bash_profile or`,`.profile`

```shell
PATH=$PATH:/usr/local/sbin
```

#### 启动rabbitmq

```shell
sudo rabbitmq-server
```

### 安装Redis

#### 下载地址:
URL : [http://redis.io/download] (http://redis.io/download)

#### install

```shell
$ tar xzf redis-3.2.0.tar.gz
$ cd redis-3.2.0
$ make
```
#### Start

```shell
src/redis-server --port 8088
```
