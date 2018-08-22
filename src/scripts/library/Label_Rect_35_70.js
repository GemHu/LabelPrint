var baseLabel = require('./Label_Rect');

module.exports = {
    print: function (api, data, param) {
        param = param || {};
        param.width = 70;
        param.height = 35;
        param.header = param.header || 10;
        param.margin = param.margin || 3;
        param.marginV = param.marginV || 1.5;
        param.qrcodeWidth = param.qrcodeWidth || 15;
        param.logoWidth = param.logoWidth || 23;
        param.fontSize = param.fontSize || 3.5;

        return baseLabel.print(api, data, param);
    },
    preview: function (data, param) {
        param = param || {};
        param.labelStyle = "35-70";
        return baseLabel.preview(data, param);
    }
};
