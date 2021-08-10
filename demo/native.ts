import { NativeModules, Linking, ActionSheetIOS, Alert, Platform } from 'react-native'
import ActionSheet from 'react-native-general-actionsheet'

interface IResult {
    code: 404 | 200 | 500; // 404 没有找到相关地图app 200 成功  500调用出错，库有没有导进来
    mapItems?: Array<IMapItem>
}

interface IMapItem {
    url: string;
    title: string;
}

// 扩展参数，暂时不用
interface IMapRouter {
    latitude?: number;
    longitude?: number;
    name?: string;
    startName?: string; // 我的位置
    startLatitude?: number;
    startLongitude?: number;
}

const mapConfig: IMapRouter = {

}

// 自定义UI可以用这个，选择了一个app调用openMapRouter
const _getMapRouterApp = (latitude: number, longitude: number) => {
    mapConfig.latitude = latitude
    mapConfig.longitude = longitude
    const openMap = NativeModules.RNOpenMapNavigation
    return new Promise<IResult>((resolve, reject) => {
        if (openMap) {
            openMap.getMapRouterApp(latitude, longitude).then(res => {
                resolve(res)
            }).catch(e => {
                reject(e)
            })
        } else {
            reject({ code: 404 })
        }
    })
}

// 仅仅只是打开苹果地图方法
const _openMapIOS = (latitude: number, longitude: number) => {
    const openMap = NativeModules.RNOpenMapNavigation
    return new Promise<IResult>((resolve, reject) => {
        if (openMap) {
            openMap.openIOSMapNavigation(latitude, longitude).then(res => {
                resolve(res)
            }).catch(e => {
                reject(e)
            })
        } else {

        }
    })
}

const _openMapActionSheet = (latitude: number, longitude: number) => {
    mapConfig.latitude = latitude
    mapConfig.longitude = longitude
    _getMapRouterApp(latitude, longitude).then(res => {
        ActionSheet.showActionSheetWithOptions({
            options: [...res.mapItems?.map((item) => item.title), "取消"],
            cancelButtonIndex: res.mapItems.length
        }, (btnIndex) => {
            if (btnIndex < res.mapItems.length) {
                if (!res.mapItems[btnIndex].url) {
                    // 打开iOS自带地图
                    _openMapIOS(latitude, longitude)
                }
            }
            console.log("btnIndex:" + btnIndex)
        })

    })
}

// 打开地图导航，配合_getMapRouterApp的返回mapItem一起使用
const _openMapRouter = (item: IMapItem) => {
    if (!item.url) {
        return _openMapIOS(mapConfig.latitude, mapConfig.longitude)
    }
    return Linking.openURL(item.url)
}

export default {
    getMapRouterApp: _getMapRouterApp,
    openMapIOS: _openMapIOS,
    openMapActionSheet: _openMapActionSheet,
    openMapRouter: _openMapRouter
}