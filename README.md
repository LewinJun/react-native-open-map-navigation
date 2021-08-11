# react-native-open-map-navigation
地图导航,打开手机自带的地图导航App，打开iOS系统自带的地图

## 如下图
![image](https://github.com/LewinJun/react-native-open-map-navigation/blob/master/demo.png)


## Table of contents
- [Install](#install)
- [Usage](#usage)

## Install
### 1: yarn add 或者npm install
`yarn add react-native-open-map-navigation  `

### 2: iOS需要配置url scheme白名单，iOS工程Info.plist添加如下配置
```xml
<key>LSApplicationQueriesSchemes</key>
<array>
	<string>baidumap</string>
	<string>iosamap</string>
	<string>comgooglemaps</string>
	<string>qqmap</string>
</array>
```



## Usage
### NOTE: 可以参考Example的App.js中的方法

```javascript
import OpenMapNavigation from 'react-native-open-map-navigation'

// 经纬度，actionSheet 选择，不用去管UI
OpenMapNavigation.openMapActionSheet("121.467237", "31.234532", "上海华盛大公馆", {
              onFail: (e) => {
                console.log(e)
              },
              onNoMapApp: () => {
                console.log("没有相关地图")
              },
              onSelectItem: (item) => {
                console.log("选择了：%o", item)
              }
            })
// 只返回当前支持跳转的地图app url和title,  需要自行写UI列表
OpenMapNavigation.getMapRouterApp("121.467237", "31.234532", "上海华盛大公馆")
// getMapRouterApp 返回的item,打开地图
OpenMapNavigation.openMapRouter(mapItem)
// 检查是否安装了某个app
OpenMapNavigation.appAndroidPackageInstalled("安卓的包名com.test.main")
// 打开iOS自带的地图方法
OpenMapNavigation.openMapIOS("121.467237", "31.234532", "上海华盛大公馆")
```

