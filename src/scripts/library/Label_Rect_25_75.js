var label = require('./Label_Rect');

module.exports = {
    print: function (api, data, param) {
        param = param || {};
        param.width = 75;
        param.height = 25;
        param.header = 0;
        param.marginH = typeof param.marginH === "number" ? param.marginH : 3;
        param.marginV = typeof param.marginV === "number" ? param.marginV : 1.5;
        param.marginLeft = typeof param.marginLeft === "number" ? param.marginLeft : 18;
        param.fontSize = param.fontSize || 3.5;
        param.qrcodeWidth = typeof param.qrcodeWidth === "number" ? param.qrcodeWidth : 18;

        param.showQrcodeText = typeof param.showQrcodeText === "boolean" ? param.showQrcodeText : true;
        param.qrcodeTextWidth = param.width - param.marginH;
        param.qrcodeTextAlign = 2;

        return label.print(api, data, param);
    },
    preview: function (data, param) {
        param = param || {};
        param.labelStyle = "25-75";
        param.fontSize = param.fontSize || "4.5mm";
        // param.logo = param.logo || "label-icon-chinanet-v";
        param.logo = param.logo || "label-icon-cmcc-v";
        param.showQrcodeText = typeof param.showQrcodeText === "boolean" ? param.showQrcodeText : true;

        return label.preview(data, param);
    }
};
