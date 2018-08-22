var baseLabel = require('./Label_Rect');

module.exports = {
    print: function (api, data, param) {
        param = param || {};
        param.width = 60;
        param.height = 40;
        param.header = typeof param.header === "number" ? param.header : 8;
        param.qrcodeWidth = typeof param.qrcodeWidth === "number" ? param.qrcodeWidth : 20;
        param.fontSize = param.fontSize || 3.5;
        param.marginH = typeof param.marginH === "number" ? param.marginH : 3;
        param.marginV = typeof param.marginV === "number" ? param.marginV : 2;
        param.fontStyle = typeof param.fontStyle === "number" ? param.fontStyle : 1;

        return label.print(api, data, param);
    },
    preview: function (data, param) {
        param = param || {};
        param.labelStyle = "40-60";
        return label.preview(data, param);
    }
};
