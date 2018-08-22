var baseLabel = require('./Label_Sheet_F');
var printUtils = require('../PrintUtils');

module.exports = {
    printQrcode: function (api, data, param) {
        param = param || {};
        param.width = 68;
        param.height = 25;
        param.tail = 30;
        param.margin = param.margin || 1.25;
        param.marginH = param.marginH || 1.5;
        param.fontSize = param.fontSize || 3;
        // param.showLogo = typeof param.showLogo === "boolean" ? param.showLogo : true;

        return baseLabel.printQrcode(api, data, param);
    },
    previewQrcode: function (data, param) {
        printUtils.setCurrType("QS-02F").showCurrType();
        param = param || {};
        param.labelStyle = "F-38-25-40";
        param.fontSize = param.fontSize || "3.5mm";
        // param.showLogo = typeof param.showLogo === "boolean" ? param.showLogo : true;

        return baseLabel.previewQrcode(data, param);
    },
    preview: function (data, param) {
        return this.previewQrcode(data, param);
    },
    print: function (api, data, param) {
        return this.printQrcode(api, data, param);
    }
};
