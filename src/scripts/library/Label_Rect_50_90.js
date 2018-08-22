var baseLabel = require('./Label_Rect');
var printUtils = require('../PrintUtils');

module.exports = {
    preview: function (data, param) {
        printUtils.setCurrType("SP50-90").showCurrType();
        param = param || {};
        param.labelStyle = "50-90";
        param.fontSize = param.fontSize || "4mm";
        // param.showQrcodeText = typeof param.showQrcodeText === "boolean" ? param.showQrcodeText : true;

        return baseLabel.preview(data, param);
    },
    print: function (api, data, param) {
        param = param || {};
        param.width = 90;
        param.height = 50;
        param.header = param.header || 7;
        param.marginH = param.marginH || 4;
        param.marginV = param.marginV || 2;
        param.qrcodeWidth = param.qrcodeWidth || 16;
        param.logoWidth = param.logoWidth || 33;
        param.fontSize = param.fontSize || 4;
        param.titleSize = param.titleSize || 5.5;
        // param.qrcodePadding = param.qrcodePadding || 2.5;
        param.fontName = "宋体";
        param.qrcodeTextAlign = 2;
        param.qrcodeTextWidth = param.width - param.marginH;
        // param.offsetY = api.isPostek() ? 0 : 2;
        // param.showQrcodeText = typeof param.showQrcodeText === "boolean" ? param.showQrcodeText : true;
        param.qrcodeTop = param.height - param.qrcodeWidth - param.marginH;

        return baseLabel.print(api, data, param);
    }
};
