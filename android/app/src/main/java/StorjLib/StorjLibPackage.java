package StorjLib;

import com.facebook.react.ReactPackage;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.uimanager.ViewManager;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import StorjLib.Services.ServiceModule;

/**
 * Created by Yaroslav-Note on 1/4/2018.
 */

public class StorjLibPackage implements ReactPackage {

    @Override
    public List<ViewManager> createViewManagers(ReactApplicationContext reactContext) {
        return Collections.emptyList();
    }

    @Override
    public List<NativeModule> createNativeModules(
            ReactApplicationContext reactContext) {
        List<NativeModule> modules = new ArrayList<>();

        modules.add(new StorjLibModule(reactContext));
        modules.add(new FilePickerModule(reactContext));
        modules.add(new ServiceModule(reactContext));

        return modules;
    }

}