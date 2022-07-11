##### 1. 初始化环境
```
yarn init -y
``` 

#### 2. 初始化完成以后写ts的测试文件：
```
it('init', () => {
	expect(true).toBe(true)
})
```
会有红色波浪线语法报错
##### （1）解决ts报错
```
npx tsc --init
```
初始化ts配置文件会报错，因为需要typescript环境，安装typescript
```
yarn add typescript --dev
```
装完typescript再去执行 **npx tsc --init** , 执行完成以后会生成*tsconfig.json*文件

##### （2） 解决jest语法报错（上面测试文件it和expect会飘红）
```
yarn add jest @types/jest --dev
```
有了这些包就能识别jest的expect，it等方法了。
安装完成以后还是没有解决报错，要修改tsconfig.json文件夹中的type属性修改为：["jest"],修改完以后报错解决。

#### 3. 在package.json中添加执行命令
```
"script": {
	"test": "jest"
}
```

#### 4. 执行yarn test 执行通过

#### 5. 测试ESM模块时能否正常使用
新建一个文件a.ts导出一个方法：
```
export function add(a, b) {
	return a + b
}
```
这里写的a,b会报红色波浪线，因为ts不允许any类型，可以在tsconfig.json中把他修改成允许："noImplicitAny": false
在测试文件中引入
```
import { add } from './a'

it('init', () => {
	expect(add(1,2)).toBe(2)
})
```
执行yarn test会失败，因为jest的运行环境是nodejs环境，是cmmonjs规范，export和import是ESM规范，需要使用babel转换，配置babel：
```
yarn add --dev babel-jest @babel/core @babel/preset-env
```
安装完成以后创建一个babel.config.js：
```
module.exports = {  
	presets: [['@babel/preset-env', {targets: {node: 'current'}}]],  
}
```
配置完成以后还要支持typescript：
```
yarn add --dev @babel/preset-typescript
```
修改babel.config.js
```
module.exports = {  
	presets: [['@babel/preset-env', {targets: {node: 'current'}}],  
	'@babel/preset-typescript',],  
}
```

然后在执行yarn test 测试通过