package StorjLib.CallbackWrappers;

import com.facebook.react.bridge.Promise;

import StorjLib.GsonSingle;
import StorjLib.Models.FileModel;
import StorjLib.Responses.SingleResponse;
import StorjLib.StorjTypesWrappers.BucketWrapper;
import io.storj.libstorj.Bucket;
import io.storj.libstorj.File;
import io.storj.libstorj.ListFilesCallback;

/**
 * Created by Crawter on 26.02.2018.
 */

public class ListFilesCallbackWrapper implements ListFilesCallback {
    private Promise _promise;

    public ListFilesCallbackWrapper(Promise promise) {
        _promise = promise;
    }

    @Override
    public void onFilesReceived(File[] files) {

        _promise.resolve(new SingleResponse(true, toJson(toBucketModelArray(files)), null).toWritableMap());
    }

    @Override
    public void onError(int code, String message) {
        //TODO: create error model to pass both message and error code
        _promise.resolve(new SingleResponse(false, null, message).toWritableMap());
    }

    private FileModel[] toBucketModelArray(File[] buckets) {
        int length = buckets.length;
        FileModel[] result = new FileModel[length];

        for(int i = 0; i < length; i++) {
            result[i] = new FileModel(buckets[i]);
        }

        return result;
    }

    private String toJson(FileModel[] convertible) {
        return GsonSingle.getInstanse().toJson(convertible);
    }   
}