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

interface IOpenActionSheet {
    onSelectItem?: (item: IMapItem) => void;
    onNoMapApp?: () => void;
    onFail?: (e: any) => void;
}

// 扩展参数，暂时不用
interface IMapRouter {
    latitude?: number;
    longitude?: number;
    address?: string;
    name?: string;
    startName?: string; // 我的位置
    startLatitude?: number;
    startLongitude?: number;
}

const mapConfig: IMapRouter = {

}

// 自定义UI可以用这个，选择了一个app调用openMapRouter
const _getMapRouterApp = (longitude: number, latitude: number, address: string) => {
    mapConfig.latitude = latitude
    mapConfig.longitude = longitude
    const openMap = NativeModules.RNOpenMapNavigation
    return new Promise<IResult>((resolve, reject) => {
        if (openMap) {
            openMap.getMapRouterApp(longitude, latitude, address).then(res => {
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
const _openMapIOS = (longitude: number, latitude: number, address: string) => {
    const openMap = NativeModules.RNOpenMapNavigation
    return new Promise<IResult>((resolve, reject) => {
        if (openMap) {
            openMap.openIOSMapNavigation(longitude, latitude, address).then(res => {
                resolve(res)
            }).catch(e => {
                reject(e)
            })
        } else {

        }
    })
}

const _openMapActionSheet = (longitude: number, latitude: number, address: string, callBack: IOpenActionSheet) => {
    mapConfig.latitude = latitude
    mapConfig.longitude = longitude
    mapConfig.address = address
    _getMapRouterApp(longitude, latitude, address).then(res => {
        if (!res || !res.mapItems || res.mapItems?.length === 0) {
            callBack && callBack?.onNoMapApp && callBack?.onNoMapApp()
            return;
        }
        ActionSheet.showActionSheetWithOptions({
            options: [...res.mapItems?.map((item) => item.title), "取消"],
            cancelButtonIndex: res.mapItems.length
        }, (btnIndex) => {
            if (btnIndex < res.mapItems.length) {
                _openMapRouter(res.mapItems[btnIndex])
            }
            callBack && callBack?.onSelectItem && callBack?.onSelectItem(res.mapItems[btnIndex])
        })

    }).catch(e => {
        callBack && callBack?.onFail && callBack?.onFail(e)
    })
}

// 打开地图导航，配合_getMapRouterApp的返回mapItem一起使用
const _openMapRouter = (item: IMapItem) => {
    if (!item.url) {
        return _openMapIOS(mapConfig.longitude, mapConfig.latitude, mapConfig.address)
    }
    return Linking.openURL(item.url)
}

const _appAndroidPackageInstalled = (packageName: string) => {
    const openMap = NativeModules.RNOpenMapNavigation
    return new Promise<boolean>((resolve, reject) => {
        if (Platform.OS === 'ios') {
            reject({ code: 500, msg: "ios 不支持此方法" })
            return
        }
        if (openMap) {
            openMap.appPackageInstalled(packageName).then(res => {
                resolve(res)
            }).catch(e => {
                reject(e)
            })
        } else {
            reject({ code: 404 })
        }
    })
}

export default {
    getMapRouterApp: _getMapRouterApp,
    openMapIOS: _openMapIOS,
    openMapActionSheet: _openMapActionSheet,
    openMapRouter: _openMapRouter,
    appAndroidPackageInstalled: _appAndroidPackageInstalled
}