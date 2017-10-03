// import { AsyncStorage, Platform } from 'react-native';
// import { observable, computed } from 'mobx';
// import { assign } from 'lodash';
// import NetworkOps from 'App/src/network/NetworkOps';
// import * as Debug from 'App/src/Debug';
// import { jsonStringify } from 'App/src/utils/Utils';
// import * as Urls from 'App/src/network/Urls';
// import { makeTFError } from 'App/src/utils/Errors';
// import { startApp } from 'App/src/screens/Screens';
// import FCM from 'react-native-fcm';

// const PREFIX = 'tnf';
// const TOKEN_KEY = `${PREFIX}:auth_token`;

export default class Auth {

  async askPermission() {
    // let fcmToken = '';
    // let apnsToken = '';

    // if (Platform.OS === 'android') {
    //   // Debug.logFn(() => 'FCM to ask for permission android');
    //   try {
    //     FCM.requestPermissions();
    //     fcmToken = await FCM.getFCMToken();
    //   } catch (error) {
    //     // Debug.logFn(() => `FCM android permission/token error ${error}`);
    //   }
    // } else {
      // Debug.logFn(() => 'FCM to ask for permission ios');
      // try {
      //   await FCM.requestPermissions();
      //   this.fcmToken = await FCM.getFCMToken();
      //   this.apnsToken = await FCM.getAPNSToken();
      // } catch (error) {
      //   console.log(`FCM iOS permission/token error ${error}`);
      // }
    // }
    // return [this.fcmToken, this.apnsToken];
  }
}
