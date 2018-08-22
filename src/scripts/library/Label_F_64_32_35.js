var baseLabel = require('./Label_Sheet_F');
module.exports = {
    print: function (api, data, param) {
        return this.printQrcode(api, data, param);
    },
    preview: function (data, param) {
        return this.previewQrcode(data, param);
    },
    printQrcode: function (api, data, param) {
        param = param || {};
        param.width = 99;
        param.height = 32;
        param.tail = 35;
        param.margin = param.margin || 1.5;
        param.marginH = param.marginH || 2.5;
        param.fontSize = param.fontSize || 3.7;

        return baseLabel.printQrcode(api, data, param);
    },
    previewQrcode: function (data, param) {
        param = param || {};
        param.labelStyle = "F-64-32-35";
        param.codeWidth = 20;
        param.fontSize = param.fontSize || "4.0mm";

        return baseLabel.previewQrcode(data, param);
    }
};
