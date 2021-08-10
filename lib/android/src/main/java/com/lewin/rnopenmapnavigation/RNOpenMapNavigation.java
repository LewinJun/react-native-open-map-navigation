package com.lewin.rnopenmapnavigation;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

public class RNOpenMapNavigation extends ReactContextBaseJavaModule {

    public RNOpenMapNavigation(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    public String getName() {
        return "RNOpenMapNavigation";
    }

    //getMapRouterApp
    @ReactMethod
    public void getMapRouterApp(double latitude, double longitude,Promise promise) {

    }

}
