import { NativeModules, Linking, ActionSheetIOS, Alert, Platform } from 'react-native'

interface IResult {
    code: 404 | 200 | 500; // 404 没有找到相关地图app 200 成功  500调用出错，库有没有导进来
    mapItems: Array<{
        url: string;
        title: string;
    }>
}

const _mapNavigation = (latitude: number, longitude: number) => {
    const openMap = NativeModules.RNOpenMapNavigation
    return new Promise<IResult>((resolve, reject) => {
        if (openMap) {
            openMap.openMapNavigation(latitude, longitude).then(res => {
                resolve(res)
            }).catch(e => {
                reject(e)
            })
        } else {

        }
    })
}

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

const _openMap = (latitude: number, longitude: number) => {
    _mapNavigation(latitude, longitude).then(res => {
        // if (Platform.OS === "ios") {
        ActionSheetIOS.showActionSheetWithOptions({
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
        // } else {
        // }
    })
}

export default {
    mapNavigation: _mapNavigation,
    openMapIOS: _openMapIOS,
    openMap: _openMap
}