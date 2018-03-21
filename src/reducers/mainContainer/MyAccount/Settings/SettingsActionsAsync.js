import SyncModule from '../../../../utils/SyncModule';
import settingsActions from './SettingsActions';

export function listSettingsAsync(settingsId) {
    return async (dispatch) => {
        let getSettingsResponse = await SyncModule.listSettings(settingsId);

        if(getSettingsResponse.isSuccess) {
            let settings = JSON.parse(getSettingsResponse.result).syncSettings;
            const newSettings = getObjectFromInt(settings);

            dispatch(settingsActions.listSettings(newSettings));
        }
    };
}

export function syncPhotosAsync(settingsId, value, prevSettingsState) {
    return async (dispatch) => {
        _sync(dispatch, 
            settingsId,
            value, 
            prevSettingsState, 
            settingsActions.photosSync, 
            (settingsState) => settingsState.syncPhotos,
            (settingsState) => settingsState.syncPhotos = value);
    };
}

export function syncMoviesAsync(settingsId, value, prevSettingsState) {
    return async (dispatch) => {
        _sync(dispatch, 
            settingsId,
            value, 
            prevSettingsState, 
            settingsActions.moviesSync, 
            (settingsState) => settingsState.syncMovies,
            (settingsState) => settingsState.syncMovies = value);
    };
}

export function syncDocumentsAsync(settingsId, value, prevSettingsState) {
    return async (dispatch) => {
        _sync(dispatch, 
            settingsId,
            value, 
            prevSettingsState, 
            settingsActions.documentsSync, 
            (settingsState) => settingsState.syncDocuments,
            (settingsState) => settingsState.syncDocuments = value);
    };
}

export function syncDownloadsAsync(settingsId, value, prevSettingsState) {
    return async (dispatch) => {
        _sync(dispatch, 
            settingsId,
            value, 
            prevSettingsState, 
            settingsActions.downloadsSync, 
            (settingsState) => settingsState.syncDownloads,
            (settingsState) => settingsState.syncDownloads = value);
    };
}

async function _sync(dispatch, settingsId, value, settingsState, actionCallback, getterCallback, setterCallback) {
    dispatch(actionCallback(value));
    
    const prevValue = getterCallback(settingsState);
    setterCallback(settingsState, value);

    let updateSettingsResponse = await SyncModule.updateSyncSettings(settingsId, getIntFromObject(settingsState));
    console.log("updateSettingsResponse", updateSettingsResponse);
    if(!updateSettingsResponse.isSuccess) {
        dispatch(actionCallback(prevValue));
    }
}

function getObjectFromInt(settings) {
    return {
        syncStatus: settings & SYNC_ENUM.SYNC_ON ? true : false, 
        onWifi: settings & SYNC_ENUM.ON_WIFI ? true : false,
        onCharging: settings & SYNC_ENUM.ON_CHARGING ? true : false,
        syncPhotos: settings & SYNC_ENUM.SYNC_PHOTOS ? true : false,
        syncMovies: settings & SYNC_ENUM.SYNC_MOVIES ? true : false,
        syncDocuments: settings & SYNC_ENUM.SYNC_DOCUMENTS ? true : false,
        syncDownloads: settings & SYNC_ENUM.SYNC_DOWNLOADS ? true : false,
    };
}

function getIntFromObject(settings) {
    let settingsInt = 0;

    settingsInt = settings.syncStatus ? settingsInt | SYNC_ENUM.SYNC_ON : settingsInt;
    settingsInt = settings.onWifi ? settingsInt | SYNC_ENUM.ON_WIFI : settingsInt;
    settingsInt = settings.onCharging ? settingsInt | SYNC_ENUM.ON_CHARGING : settingsInt;
    settingsInt = settings.syncPhotos ? settingsInt | SYNC_ENUM.SYNC_PHOTOS : settingsInt;
    settingsInt = settings.syncMovies ? settingsInt | SYNC_ENUM.SYNC_MOVIES : settingsInt;
    settingsInt = settings.syncDocuments ? settingsInt | SYNC_ENUM.SYNC_DOCUMENTS : settingsInt;
    settingsInt = settings.syncDownloads ? settingsInt | SYNC_ENUM.SYNC_DOWNLOADS : settingsInt;

    return settingsInt;
}

export const SYNC_ENUM = {
    SYNC_ON:        0b10000000,
    ON_WIFI:        0b01000000,
    ON_CHARGING:    0b00100000,
    SYNC_PHOTOS:    0b00010000,
    SYNC_MOVIES:    0b00001000,
    SYNC_DOCUMENTS: 0b00000100,
    SYNC_DOWNLOADS: 0b00000010,
};