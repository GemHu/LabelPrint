var baseLabel = require('./Label_Rect');
var printUtils = require('../PrintUtils');

module.exports = {
    print: function (api, data, param) {
        param = param || {};
        param.width = 90;
        param.height = 30;
        param.header = param.header || 9;
        param.margin = param.margin || 3;
        param.marginV = param.marginV || 1.5;
        param.qrcodeWidth = param.qrcodeWidth || 15;
        param.logoWidth = param.logoWidth || 23;
        param.fontSize = param.fontSize || 4;

        return baseLabel.print(api, data, param);
    },
    preview: function (data, param) {
        printUtils.setCurrType("SP30-90").showCurrType();

        param = param || {};
        param.labelStyle = "30-90";
        param.fontSize = param.fontSize || "4mm";
        param.background = param.background || "#00BAEB";
        // param.headerBackground = param.headerBackground || "#0095CE";

        return baseLabel.preview(data, param);
    }
};
