var baseLabel = require('./Label_Sheet_F');

module.exports = {
    printQrcode: function (api, data, param) {
        param = param || {};
        param.width = 70;
        param.height = 40;
        param.tail = 30;
        param.margin = param.margin || 1.5;
        // param.marginH = param.marginH || 1.5;
        param.fontSize = param.fontSize || 3;
        // param.showLogo = typeof param.showLogo === "boolean" ? param.showLogo : true;

        return baseLabel.printQrcode(api, data, param);
    },
    previewQrcode: function (data, param) {
        param = param || {};
        param.labelStyle = "F-40-40-30";
        param.fontSize = param.fontSize || "3.5mm";
        param.qrcodeWidth = 40;
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
