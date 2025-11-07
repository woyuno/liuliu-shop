"use strict";
const common_vendor = require("../common/vendor.js");
const reverseCode = (lo, la) => {
  return new Promise((resolve, reject) => {
    common_vendor.index.request({
      url: "https://restapi.amap.com/v3/geocode/regeo",
      data: {
        key: "bc8cad0d87d1287717e5f1007d8a3309",
        location: `${lo},${la}`
      },
      success(res) {
        common_vendor.index.__f__("log", "at utils/getcode.ts:19", "高德api接口返回", res);
        const data = res.data;
        if (data.status !== "1") {
          reject("接口请求失败");
          return;
        }
        const address = data.regeocode.addressComponent.city.length ? data.regeocode.addressComponent.city : data.regeocode.addressComponent.province;
        common_vendor.index.__f__("log", "at utils/getcode.ts:26", "地址是:" + address);
        resolve(address);
      },
      fail(err) {
        reject(`请求失败:${err.errMsg}`);
      }
    });
  });
};
exports.reverseCode = reverseCode;
//# sourceMappingURL=../../.sourcemap/mp-weixin/utils/getcode.js.map
