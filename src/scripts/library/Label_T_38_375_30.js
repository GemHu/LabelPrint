var baseLabel = require('./Label_Sheet_F');

module.exports = {
    printQrcode: function (api, data, param) {
        param = param || {};
        param.width = 68;
        param.height = 37.5;
        param.tail = 30;
        param.sheetCount = 3;
        param.margin = param.margin || 1.25;
        param.marginH = param.marginH || 1.5;
        param.fontSize = param.fontSize || 2.56;

        return baseLabel.printQrcode(api, data, param);
    },
    printBarcode: function (api, data, param) {
        param = param || {};
        param.width = 68;
        param.height = 37.5;
        param.tail = 30;
        param.sheetCount = 3;
        param.margin = param.margin || 1.25;
        param.marginH = param.marginH || 1.5;
        param.fontSize = param.fontSize || 2.56;

        return baseLabel.printBarcode(api, data, param);
    },
    previewQrcode: function (data, param) {
        param = param || {};
        param.labelStyle = "T-38-375-30";
        param.fontSize = param.fontSize || "3.0mm";

        return baseLabel.previewQrcode(data, param);
    },
    previewBarcode: function (data, param) {
        param = param || {};
        param.labelStyle = "T-38-375-30";
        param.fontSize = param.fontSize || "3.0mm";

        return baseLabel.previewBarcode(data, param);
    }
};
