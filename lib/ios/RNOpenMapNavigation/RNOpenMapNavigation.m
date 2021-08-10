//
//  RN.m
//  RNOpenMapNavigation
//
//  Created by apple on 2021/8/9.
//

#import "RNOpenMapNavigation.h"
#import <UIKit/UIKit.h>
#import <CoreLocation/CoreLocation.h>
#import <MapKit/MapKit.h>

@implementation RNOpenMapNavigation
RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(getMapRouterApp:(NSString*)longitude latitude:(NSString*)latitude address:(NSString*)address success:(RCTPromiseResolveBlock)success failure:(RCTResponseErrorBlock)failure){
  dispatch_sync(dispatch_get_main_queue(), ^{
      
      success(@{@"code": @(200), @"mapItems":[self getInstalledMapAppWithEndLocation:longitude latitude:latitude address:address]});
  });
  
}

RCT_EXPORT_METHOD(openIOSMapNavigation:(NSString*)longitude latitude:(NSString*)latitude address:(NSString*)address success:(RCTPromiseResolveBlock)success failure:(RCTResponseErrorBlock)failure){
  dispatch_sync(dispatch_get_main_queue(), ^{
      CLLocationCoordinate2D location = CLLocationCoordinate2DMake([latitude doubleValue], [longitude doubleValue]);
      [self navAppleMap: location address:address];
  });
  
}

#pragma mark - 导航方法
- (NSArray *)getInstalledMapAppWithEndLocation:(NSString*)longitude latitude:(NSString*)latitude address:(NSString*)address
{
    NSMutableArray *maps = [NSMutableArray array];
    
    //苹果地图
    NSMutableDictionary *iosMapDic = [NSMutableDictionary dictionary];
    iosMapDic[@"title"] = @"苹果地图";
    [maps addObject:iosMapDic];
    
    NSString *toName = address;
    if (toName == nil || toName.length == 0) {
        toName = @"已选择的位置";
    }
    
    //百度地图
    if ([[UIApplication sharedApplication] canOpenURL:[NSURL URLWithString:@"baidumap://"]]) {
        NSMutableDictionary *baiduMapDic = [NSMutableDictionary dictionary];
        baiduMapDic[@"title"] = @"百度地图";
        NSString *urlString = [[NSString stringWithFormat:@"baidumap://map/direction?origin={{我的位置}}&destination=latlng:%@,%@|name:%@&mode=driving&coord_type=gcj02",latitude,longitude,toName] stringByAddingPercentEscapesUsingEncoding:NSUTF8StringEncoding];
        baiduMapDic[@"url"] = urlString;
        [maps addObject:baiduMapDic];
    }
    
    //高德地图
    if ([[UIApplication sharedApplication] canOpenURL:[NSURL URLWithString:@"iosamap://"]]) {
        NSMutableDictionary *gaodeMapDic = [NSMutableDictionary dictionary];
        gaodeMapDic[@"title"] = @"高德地图";
        NSString *urlString = [[NSString stringWithFormat:@"iosamap://path?sourceApplication=%@&backScheme=%@&dlat=%@&dlon=%@&t=0&dev=0&style=2&dname=%@",@"导航功能",@"nav123456",latitude,longitude, toName] stringByAddingPercentEscapesUsingEncoding:NSUTF8StringEncoding];
        gaodeMapDic[@"url"] = urlString;
        [maps addObject:gaodeMapDic];
    }
    
    //谷歌地图
    if ([[UIApplication sharedApplication] canOpenURL:[NSURL URLWithString:@"comgooglemaps://"]]) {
        NSMutableDictionary *googleMapDic = [NSMutableDictionary dictionary];
        googleMapDic[@"title"] = @"谷歌地图";
        NSString *urlString = [[NSString stringWithFormat:@"comgooglemaps://?x-source=%@&x-success=%@&saddr=&daddr=%@,%@&directionsmode=driving",@"导航测试",@"nav123456",latitude, longitude] stringByAddingPercentEscapesUsingEncoding:NSUTF8StringEncoding];
        googleMapDic[@"url"] = urlString;
        [maps addObject:googleMapDic];
    }
    
    //腾讯地图
    if ([[UIApplication sharedApplication] canOpenURL:[NSURL URLWithString:@"qqmap://"]]) {
        NSMutableDictionary *qqMapDic = [NSMutableDictionary dictionary];
        qqMapDic[@"title"] = @"腾讯地图";
        NSString *urlString = [[NSString stringWithFormat:@"qqmap://map/routeplan?from=我的位置&type=drive&tocoord=%@,%@&to=%@&coord_type=1&policy=0",latitude, longitude, address] stringByAddingPercentEscapesUsingEncoding:NSUTF8StringEncoding];
        qqMapDic[@"url"] = urlString;
        [maps addObject:qqMapDic];
    }
    
    return maps;
}

//#pragma mark LCActionSheetDelegate
//-(void)actionSheet:(LCActionSheet *)actionSheet didClickedButtonAtIndex:(NSInteger)buttonIndex
//{
//    if (buttonIndex != -1) {
//        if (buttonIndex == 0) {
//            [self navAppleMap];
//            return;
//        }
//        NSDictionary *dic = self.maps[buttonIndex];
//        NSString *urlString = dic[@"url"];
//        [[UIApplication sharedApplication] openURL:[NSURL URLWithString:urlString]];
//    }
//}
 
//苹果地图
- (void)navAppleMap:(CLLocationCoordinate2D)gps address:(NSString*)address
{
    
    MKMapItem *currentLoc = [MKMapItem mapItemForCurrentLocation];
    MKMapItem *toLocation = [[MKMapItem alloc] initWithPlacemark:[[MKPlacemark alloc] initWithCoordinate:gps addressDictionary:nil]];
    NSArray *items = @[currentLoc,toLocation];
    NSDictionary *dic = @{
                          MKLaunchOptionsDirectionsModeKey : MKLaunchOptionsDirectionsModeDriving,
                          MKLaunchOptionsMapTypeKey : @(MKMapTypeStandard),
                          MKLaunchOptionsShowsTrafficKey : @(YES)
                          };
    
    [MKMapItem openMapsWithItems:items launchOptions:dic];
}

@end
