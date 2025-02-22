# EasyAgent

EasyAgent是一个简单而又强大的Agent框架。该框架主要是用于演示用途，并且以工程化形式展现。

路线图：  
- [x] ChatBot的开发  
- [x] Tool的调用  
- [ ] Session功能和持久储存  
- [ ] Prompt的管理，选择  
- [ ] Memory功能  
- [ ] RAG数据功能
- [ ] MCP
- [ ] 多Agent合作  
- [ ] Swarm，Agent调度  

## 准备工作
你需要准备。
Nodejs >= 20
pnpm

### 安装依赖
在根目录下执行
```bash
pnpm install
```

### 注册openrouter
EasyAgent使用openrouter作为LLM的API提供，openrouter是一个llm api聚合器，使用openrouter时不需要担心封锁问题，也不需要每一种AI都存放资金，你也不需要自己去申请每一家的API Key。

前往 https://openrouter.ai/ 进行注册

## 使用
`apps` 下两个是负责业务相关的软件内容。
- backend 负责后端代码逻辑
- frontend 负责前端代码逻辑

`packages` 则是负责一些业务无关的代码
- lib 负责一些通用的代码逻辑
- agents/* 储存一些agent工具

### 配置config
我们在运行之前需要对后端的一些配置，在apps/backend/config文件夹中，可以直接修改default.toml，或者创建一个新的local.toml文件进行配置。

主要需要配置的内容为openrouter的apikey 和 langfuse（可选）这种监控追溯平台。

### 执行命令
```bash
pnpm dev
```
即可开发执行，之后打开 `http://localhost:5173/` 就可以进行对话。
