var PrintUtils = require('../PrintUtils');
var config = require('../Config');
var baseLabel = require('./Label_Rect');

module.exports = {
    preview: function (data, param) {
        PrintUtils.setCurrType("TCM86-54").showCurrType();
        var textArray = data.textArray || [];
        var text = data.text || textArray.join('<br>');

        param = param || {};
        var fontSize = param.fontSize || "5mm";
        var showLogo = typeof param.showLogo === "boolean" ? param.showLogo : true;
        var logo = "";
        if (showLogo){
            if (config.client === "10086")
                logo = "label-icon-cmcc-h";
            else if (config.client === "10000")
                logo = "label-icon-chinanet-h";
        }

        var html = '' +
            '<div class="label label-card-54-86" style="font-size: {{fontSize}};">' +
            '   <div class="label-card-54-86-hole1"></div>' +
            '   <div class="label-card-54-86-logo {{logo}}"/>' +
            '   <div class="label-card-54-86-hole2"></div>' +
            '   <div class="label-card-54-86-body">' +
            '       <div class="label-card-54-86-body-text label-center-v">' +
            '           <div class="label-cell"><div class="label-cell-content">{{text}}</div></div>' +
            '       </div>' +
            '       <div class="label-card-54-86-body-qrcode label-qrcode" data-qrcode="{{qrcode}}"></div>' +
            '   </div>' +
            '</div>';

        return PrintUtils.buildTmp(html, {
            text: text,
            qrcode: data.qrcode,
            fontSize: fontSize,
            logo : logo
        });
    },
    print: function (api, data, param) {
        var textArray = data.textArray || [];
        var text = data.text || textArray.join('\n');

        param = param || {};
        param.width = 85;
        param.height = 54;
        param.header = typeof param.header === "number" ? param.header : 9;
        param.marginH = typeof param.marginH === "number" ? param.marginH : 5;
        param.marginV = typeof param.marginV === "number" ? param.marginV : 2;
        param.fontSize = param.fontSize || 4;
        param.qrcodeWidth = typeof param.qrcodeWidth === "number" ? param.qrcodeWidth : 25;

        return baseLabel.print(api, data, param);
    }
};
