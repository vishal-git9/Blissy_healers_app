import { Platform } from "react-native";
import DeviceInfo from "react-native-device-info";
import RNSecureKeyStore, { ACCESSIBLE } from "react-native-secure-key-store";

export const getDeviceUniqueId  = async () => {
    if (Platform.OS === "ios") {
      let bundleName = DeviceInfo.getBundleId();
      console.warn("bundleName----->", bundleName);
      let deviceIdkey = bundleName + "-deviceId";
      let deviceId = "";
      await RNSecureKeyStore.get(deviceIdkey).then(
        (res) => {
          deviceId = res;
          console.warn("DeviceId Get Success");
          console.warn(res);
          //return deviceId;
        },
        (err) => {
          console.warn("DeviceId Get Error");
          console.warn(err);
        }
      );

      if (!deviceId) {
        var device_ID = await DeviceInfo.getUniqueId();
        RNSecureKeyStore.set(deviceIdkey, device_ID, {
          accessible: ACCESSIBLE.ALWAYS_THIS_DEVICE_ONLY,
        }).then(
          (res) => {
            console.log("Set Success");
            console.log(res);
          },
          (err) => {
            console.log("Set Error");
            console.log(err);
          }
        );
        console.warn("DeviceId---->", device_ID);
        return device_ID;
      } else {
        return deviceId;
      }
    } else {
      let uniqueID = await DeviceInfo.getUniqueId();
      return uniqueID;
    }
}