var baseLabel = require('./Label_Rect');
var printUtils = require('../PrintUtils');

module.exports = {
    print: function (api, data, param) {
        param = param || {};
        param.width = 140;
        param.height = 85;
        param.header = param.header || 17;
        param.margin = param.margin || 7;
        param.marginV = param.marginV || 4;
        param.qrcodeWidth = param.qrcodeWidth || 30;
        param.logoWidth = param.logoWidth || 49;
        param.fontSize = param.fontSize || 5;
        param.titleSize = param.titleSize || 6;
        // param.qrcodePadding = param.qrcodePadding || 2.5;
        param.qrcodeTextAlign = 2;
        param.qrcodeTextWidth = param.width - param.margin * 2;
        // param.offsetY = api.isPostek() ? 0 : -1;
        // param.showQrcodeText = typeof param.showQrcodeText === "boolean" ? param.showQrcodeText : true;

        return baseLabel.print(api, data, param);
    },
    preview: function (data, param) {
        printUtils.setCurrType("SP85-140").showCurrType();

        param = param || {};
        param.titleSize = param.titleSize || "6mm";
        param.fontSize = param.fontSize || "5mm";
        param.labelStyle = "85-140";
        // param.showQrcodeText = typeof param.showQrcodeText === "boolean" ? param.showQrcodeText : true;

        return baseLabel.preview(data, param);
    }
};
