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
        param.width = 80;
        param.height = 30;
        param.tail = 35;
        param.margin = param.margin || 1.5;
        param.marginH = param.marginH || 2;
        param.fontSize = param.fontSize || 3.18;

        return baseLabel.printQrcode(api, data, param);
    },
    previewQrcode: function (data, param) {
        param = param || {};
        param.labelStyle = "L-45-30-50";
        param.fontSize = param.fontSize || "3.5mm";
        param.background = param.background || "#FF8040";

        return baseLabel.previewQrcode(data, param);
    }
};
