var baseLabel = require('./Label_Rect');
var printUtils = require('../PrintUtils');

module.exports = {
    preview: function (data, param) {
        printUtils.setCurrType("SP45-100").showCurrType();

        param = param || {};
        param.labelStyle = "45-100";
        // param.showQrcodeText = typeof param.showQrcodeText === "boolean" ? param.showQrcodeText : true;

        return baseLabel.preview(data, param);
    },
    print: function (api, data, param) {
        param = param || {};
        param.width = 100;
        param.height = 45;
        param.header = param.header || 13;
        param.margin = param.margin || 5;
        param.marginV = param.marginV || 3;
        param.qrcodeWidth = param.qrcodeWidth || 22;
        param.logoWidth = param.logoWidth || 33;
        param.fontSize = param.fontSize || 4.5;
        param.titleSize = param.titleSize || 5.5;
        // param.qrcodePadding = param.qrcodePadding || 2.5;
        param.qrcodeTextAlign = 2;
        param.qrcodeTextWidth = param.width - param.margin;
        param.offsetY = api.isPostek() ? 0 : -1;
        // param.showQrcodeText = typeof param.showQrcodeText === "boolean" ? param.showQrcodeText : true;

        return baseLabel.print(api, data, param);
    }
};
