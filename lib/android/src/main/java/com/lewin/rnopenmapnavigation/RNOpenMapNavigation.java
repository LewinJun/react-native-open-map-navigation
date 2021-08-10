package com.lewin.rnopenmapnavigation;
import android.content.Context;
import android.content.pm.ApplicationInfo;
import android.text.TextUtils;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

public class RNOpenMapNavigation extends ReactContextBaseJavaModule {

    public static String GAODE_MAP = "com.autonavi.minimap";
    public static String BAIDU_MAP = "com.baidu.BaiduMap";
    public static String TENXUN_MAP = "com.tencent.map";
    public static String GOOGLE_MAP = "com.google.android.apps.maps";

    public RNOpenMapNavigation(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    public String getName() {
        return "RNOpenMapNavigation";
    }

    //getMapRouterApp
    @ReactMethod
    public void getMapRouterApp(String latitude, String longitude, String address,Promise promise) {
        try {
            HashMap<String, Object> map = new HashMap<>();
            map.put("code", 200);
            map.put("mapItems",getInstalledMapAppWithEndLocation(latitude, longitude, address));
            promise.resolve(map);
        }catch (Exception e) {
            promise.reject(e);
        }
    }

    @ReactMethod
    public void appPackageInstalled(String packageName,Promise promise) {
        try {
            promise.resolve(isInstalled(this.getReactApplicationContext(), packageName));
        }catch (Exception e) {
            promise.reject(e);
        }
    }

    public List<WritableMap> getInstalledMapAppWithEndLocation(String latitude, String longitude, String address) {
        List<WritableMap> writableMapList = new ArrayList<>();
        String toName = address;
        if (TextUtils.isEmpty(toName)) {
            toName = "已选择的位置";
        }

        if (isInstalled(this.getReactApplicationContext(), GAODE_MAP)) {
            StringBuffer stringBuffer = new StringBuffer("androidamap://route/plan?sourceApplication=").append("openMap");
//        if (!TextUtils.isEmpty(sid)) {
//            stringBuffer.append("&sid=").append(sid);
//        }
//        if (!TextUtils.isEmpty(sla)) {
//            stringBuffer.append("&sla=").append(sla);
//        }
//        if (!TextUtils.isEmpty(slon)) {
//            stringBuffer.append("&slon=").append(slon);
//        }
//        if (!TextUtils.isEmpty(sname)) {
//            stringBuffer.append("&sname=").append(sname);
//        }
//        if (!TextUtils.isEmpty(did)) {
//            stringBuffer.append("&did=").append(did);
//        }
            stringBuffer.append("&dlat=").append(latitude);
            stringBuffer.append("&dlon=").append(longitude);
            stringBuffer.append("&dname=").append(toName);
//        stringBuffer.append("&dName=").append(dName);
//        stringBuffer.append("&dev=").append(dev);
//        stringBuffer.append("&t=").append(t);
            WritableMap map = Arguments.createMap();
            map.putString("title", "高德地图");
            map.putString("url", stringBuffer.toString());
            writableMapList.add(map);
        }
        if (isInstalled(this.getReactApplicationContext(), BAIDU_MAP)) {
            // 百度地图
            StringBuffer sb = new StringBuffer("baidumap://map/direction?mode=").append("driving");
            sb.append("&origin={{我的位置}}");
            sb.append("&destination=latlng:" + latitude + "," + longitude + "|name:"+toName+"&coord_type=gcj02");
            WritableMap baiduMap = Arguments.createMap();
            baiduMap.putString("title", "百度地图");
            baiduMap.putString("url", sb.toString());
            writableMapList.add(baiduMap);
        }
        if (isInstalled(this.getReactApplicationContext(), TENXUN_MAP)) {
            // 腾讯地图
            StringBuffer qq = new StringBuffer("qqmap://map/routeplan?type=drive&from=我的位置&to="+toName+"&coord_type=1&policy=0");
            qq.append("&tocoord=" + latitude + "," + longitude);
            WritableMap qqMap = Arguments.createMap();
            qqMap.putString("title", "腾讯地图");
            qqMap.putString("url", qq.toString());
            writableMapList.add(qqMap);
        }
        return writableMapList;
    }

    public boolean isInstalled(Context context, String packageName) {
        boolean installed = false;
        if (TextUtils.isEmpty(packageName)) {
            return false;
        }
        List<ApplicationInfo> installedApplications = context.getPackageManager().getInstalledApplications(0);
        for (ApplicationInfo in : installedApplications) {
            if (packageName.equals(in.packageName)) {
                installed = true;
                break;
            } else {
                installed = false;
            }
        }
        return installed;
    }

}
