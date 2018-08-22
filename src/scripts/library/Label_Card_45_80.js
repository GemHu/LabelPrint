var baselabel = require('./Label_Rect');

module.exports = {
    print: function (api, data, param) {
        var textArray = data.textArray || [];
        var text = data.text || textArray.join('\n');

        return exports.createLabel_Common().print(api, data, {
            width: 80 - 1,
            height: 45,
            header: 10,
            marginH: 5,
            marginV: 2,
            fontSize: 4,
            qrcodeWidth: 20
        });
    },
    preview: function (data, param) {
        param = param || {};
        var textArray = data.textArray || [];
        var text = data.text || textArray.join('<br>');

        var html = '' +
            '<div class="label label-card-45-80" style="font-size: {{fontSize}};font-weight: {{fontWeight}};">' +
            '   <div class="label-card-45-80-hole1"></div>' +
            '   <div class="label-card-45-80-logo label-center-v">' +
            '       <div class="label-cell"><div class="label-cell-content {{logo}}"></div></div>' +
            '   </div>' +
            '   <div class="label-card-45-80-hole2"></div>' +
            '   <div class="label-card-45-80-body">' +
            '       <div class="label-card-45-80-body-text label-center-v">' +
            '           <div class="label-cell"><div class="label-cell-content">{{text}}</div></div>' +
            '       </div>' +
            '       <div class="label-card-45-80-body-qrcode label-qrcode" data-qrcode="{{qrcode}}"></div>' +
            '       <div class="label-card-45-80-body-qrcode-text">{{qrcodeText}}</div>' +
            '   </div>' +
            '</div>';

        return PrintUtils.buildTmp(html, {
            text: text,
            qrcode: data.qrcode,
            qrcodeText: param.showQRCodeText ? data.qrcodeText || data.qrcode : "",
            logo: param.logo || "label-icon-chinanet-h",
            fontWeight: param.fontWeight || "bold",
            fontSize: param.fontSize || "5mm"
        });
    }
};
