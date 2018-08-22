var printUtils = require('../PrintUtils');
var config = require('../Config');

module.exports = {
    preview : function (data, param) {
        printUtils.setCurrType("GB45-60").showCurrType();

        param = param || {};
        param.background = param.background || "white";
        param.textAlign1 = param.textAlign1 || "center";
        param.textAlign2 = param.textAlign2 || "center";
        param.fontSize = param.fontSize || "3.5mm";
        var textArray = data.textArray || [];

        var qrcodeText1 = param.showQrcodeText ? (data.qrcodeText1 || data.qrcode1) : "";
        var qrcodeText2 = param.showQrcodeText ? (data.qrcodeText2 || data.qrcode2) : "";
        var sheet1 = getSheetContent(data.text1, data.qrcode1, qrcodeText1, param);
        var sheet2 = getSheetContent(data.text2, data.qrcode2, qrcodeText2, param);

        var html = '' +
            '<div class="label label-fold-45-60-H" style="font-size: {{fontSize}};">' +
            '   <div class="label-fold-45-60-H-sheet1" style="background-color:{{background}};text-align: {{textAlign1}};">' +
            '       <div class="label-fold-45-60-H-hole"/>' + sheet1 +
            '   </div>' +
            '   <div class="label-fold-45-60-H-sheet2" style="background-color:{{background}};text-align: {{textAlign2}};">' +
            '       <div class="label-fold-45-60-H-hole"/>' + sheet2 +
            '   </div>' +
            '</div>';

        return printUtils.buildTmp(html, param)
    },
    print : function (api, data, param) {
        var textArray = data.textArray || [];
        param = param || {};
        var qrcodeText1 = param.showQrcodeText ? (data.qrcodeText1 || data.qrcode1) : null;
        var qrcodeText2 = param.showQrcodeText ? (data.qrcodeText1 || data.qrcode1) : null;

        var width = 60;
        var height = 45;
        var header = 9;
        var qrcodeWidth = param.qrcodeWidth || 22;
        var qrcodeTextHeight = param.qrcodeTextHeight || 0;
        var orientation = printUtils.getOrientation();
        var sheetWidth = width / 2;
        var marginH = typeof param.marginH === "number" ? param.marginH : 2;
        var marginV = typeof param.marginV === "number" ? param.marginV : 2;
        var textWidth = sheetWidth - marginH * 2;
        var textHeight = height - header - marginV * 2;
        var fontSize = param.fontSize || 4;
        var fontName = param.fontName;
        // 字体样式，默认粗体
        var fontStyle1 = typeof param.fontStyle1 === "number" ? param.fontStyle1 : 1;
        var fontStyle2 = typeof param.fontStyle2 === "number" ? param.fontStyle2 : fontStyle1;
        // 水平对齐方式，// 默认居中对齐
        var textAlign1 = typeof param.textAlign1 === "number" ? param.textAlign1 : 1;
        var textAlign2 = typeof param.textAlign2 === "number" ? param.textAlign2 : textAlign1;
        // 垂直对齐方式，默认居中对齐
        var verticalAlign1 = typeof param.verticalAlign1 === "number" ? param.verticalAlign1 : 1;
        var verticalAlign2 = typeof param.verticalAlign2 === "number" ? param.verticalAlign2 : verticalAlign1;

        if (!api.startJob(width, height, orientation))
            return false;

        if (config.DEBUG) {
            var holeWidth = 5;
            var marginTop = 5;
            var marginLeft = (sheetWidth - holeWidth) / 2;
            api.drawRectangle(0, 0, width, height);
            api.drawLine(sheetWidth, 0, sheetWidth, height);
            api.drawRoundRectangle(marginLeft, marginTop, holeWidth, holeWidth, holeWidth / 2);
            api.drawRoundRectangle(sheetWidth + marginLeft, marginTop, holeWidth, holeWidth, holeWidth / 2);
        }

        // sheet1
        api.setItemHorizontalAlignment(textAlign1);
        api.setItemVerticalAlignment(verticalAlign1);
        if (data.text1 && data.qrcode1){
            api.drawText(data.text1, marginH, header + marginV, textWidth, textHeight - qrcodeTextHeight - qrcodeWidth, fontName, fontSize, fontStyle1);
            api.draw2DQRCode(data.qrcode1, (sheetWidth - qrcodeWidth) / 2, height - marginV - qrcodeTextHeight - qrcodeWidth, qrcodeWidth);
            if (qrcodeText1)
                api.drawText(qrcodeText1, marginH, height - marginV - qrcodeTextHeight, textWidth, qrcodeTextHeight, fontName, fontSize, fontStyle1);
        } else if (data.text1){
            api.drawText(data.text1, marginH, header + marginV, textWidth, textHeight, fontName, fontSize, fontStyle1);
        } else if (data.qrcode1){
            api.draw2DQRCode(data.qrcode1, (sheetWidth - qrcodeWidth) / 2, header + (height - header - qrcodeWidth) / 2, qrcodeWidth);
        }
        // sheet2
        api.setItemHorizontalAlignment(textAlign2);
        api.setItemVerticalAlignment(verticalAlign2);
        if (data.text2 && data.qrcode2){
            api.drawText(data.text2, sheetWidth + marginH, header + marginV, textWidth, textHeight - qrcodeTextHeight - qrcodeWidth, fontName, fontSize, fontStyle2);
            api.draw2DQRCode(data.qrcode2, sheetWidth + (sheetWidth - qrcodeWidth) / 2, height - marginV - qrcodeTextHeight - qrcodeWidth, qrcodeWidth);
            if (qrcodeText2)
                api.drawText(qrcodeText2, sheetWidth + marginH, height - marginV - qrcodeTextHeight, textWidth, qrcodeTextHeight, fontName, fontSize, fontStyle2);
        } else if (data.text2){
            api.drawText(data.text2, sheetWidth + marginH, header + marginV, textWidth, textHeight, fontName, fontSize, fontStyle2);
        } else if (data.qrcode2){
            api.draw2DQRCode(data.qrcode2, sheetWidth + (sheetWidth - qrcodeWidth) / 2, header + (height - header - qrcodeWidth) / 2, qrcodeWidth);
        }

        return api.commitJob();
    }
};

function getSheetContent(text, qrcode, qrcodeText, param) {
    param = param || {};
    param.text = text || "";
    param.qrcode = qrcode || "";
    param.qrcodeText = qrcodeText || "";
    param.marginH = 5;
    param.marginV = 5;
    param.header = 22;
    param.textWidth = 100 - param.marginH * 2;
    param.textHeight = 100 - param.header - param.marginV * 2;
    param.qrcodeTextHeight = param.qrcodeTextHeight || 0;
    param.qrcodeWidth = 60;
    param.qrcodeHeight = 40;

    var html = '';
    if (text && qrcode){
        html += '<div style="left: {{marginH}}%;width: {{textWidth}}%;top: {{header + marginV}}%;height: {{textHeight - qrcodeTextHeight - qrcodeHeight}}%;">{{text}}</div>';
        html += '<div class="label-qrcode" data-qrcode="{{qrcode}}" style="left: {{(100 - qrcodeWidth)/2}}%;width: {{qrcodeWidth}}%;top: {{100 - marginV - qrcodeTextHeight - qrcodeHeight}}%;height: {{qrcodeHeight}}%;"/>';
        html += '<div style="left: {{marginH}}%;width: {{textWidth}}%;top: {{100 - qrcodeTextHeight}}%;height: {{qrcodeTextHeight}}%;">{{qrcodeText}}</div>';
    } else if (text){
        html += '<div class="label-center-v" style="left: {{marginH}}%;width: {{textWidth}}%;top: {{header + marginV}}%;height: {{textHeight}}%;">';
        html += '   <div class="label-cell"><div class="label-cell-content">{{text}}</div></div>';
        html += '</div>';
    } else if (qrcode){
        html += '<div class="label-qrcode" data-qrcode="{{qrcode}}" style="left: {{(100 - qrcodeWidth) / 2}}%;width: {{qrcodeWidth}}%;top: {{header + (100 - header - qrcodeTextHeight - qrcodeHeight) / 2}}%;height: {{qrcodeHeight}}%;"/>';
    }

    return printUtils.render(html, param);
}
