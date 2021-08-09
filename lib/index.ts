import { NativeModules, Linking } from 'react-native'

interface IResult {
    code: 404 | 200 | 500; // 404 没有找到相关地图app 200 成功  500调用出错，库有没有导进来
    mapItem?: Array<{
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

export default {
    mapNavigation: _mapNavigation
}