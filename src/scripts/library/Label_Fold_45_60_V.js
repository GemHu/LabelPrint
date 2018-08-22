var printUtils = require('../PrintUtils');
var config = require('../Config');

function getSheetContent(text, param, rotation){
    param = param || {};
    param.text = text || "";
    param.header = 22;
    param.marginH = 5;
    param.marginV = 5;
    param.rotation = rotation || 0;

    var html = '' +
        '<div class="label-center-v" style="left: {{header}};width: {{100 - header - marginH}};top: {{marginV}};height: {{100 - marginV * 2}};">' +
        '   <div class="label-cell"><div class="label-cell-content label-rotate-{{rotation}}">{{text}}</div></div>' +
        '</div>';

    return printUtils.render(html, param);
}

module.exports = {
    preview : function(data, param){
        printUtils.setCurrType("GB45-60").showCurrType();
        param = param || {};
        param.background = param.background || "white";
        var sheet1 = getSheetContent(data.text1, param);
        var sheet2 = getSheetContent(data.text2, param, 180);

        var html = '' +
            '<div class="label label-fold-45-60-V">' +
            '   <div class="label-fold-45-60-V-sheet1" style="background-color:{{background}};">' +
            '       <div class="label-fold-45-60-V-hole"/>' + sheet1 +
            '   </div>' +
            '   <div class="label-fold-45-60-V-sheet2" style="background-color:{{background}};">' +
            '       <div class="label-fold-45-60-V-hole"/>' + sheet2 +
            '   </div>' +
            '</div>';

        return printUtils.buildTmp(html, param);
    },
    print : function (api, data, param) {
        param = param || {};
        var width = 45;
        var height = 60;
        var orientation = printUtils.getOrientation();
        var sheetHeight = height / 2;
        var header = typeof param.header === "number" ? param.header : 8;
        var marginH = typeof param.marginH === "number" ? param.marginH : 3;
        var marginV = typeof param.marginV === "number" ? param.marginV : 2;
        var qrcodeWidth = param.qrcodeWidth || 22;
        var fontSize = param.fontSize || 4;
        var fontStyle = typeof param.fontStyle === "number" ? param.fontStyle : 1;
        var fontName = param.fontName;
        var textAlign = typeof param.textAlign === "number" ? param.textAlign : 0;
        var textWidth = width - header - marginH * 2;
        var textHeight = sheetHeight - marginV * 2;

        if (!api.startJob(width, height, orientation))
            return false;

        if (config.DEBUG) {
            var holeWidth = 5;
            var holeLeft = 5;
            var holeTop = (sheetHeight - holeWidth) / 2;
            api.drawRectangle(0, 0, width, height);
            api.drawLine(0, sheetHeight, width, sheetHeight);
            api.drawRoundRectangle(holeLeft, holeTop, holeWidth, holeWidth, holeWidth / 2);
            api.drawRoundRectangle(holeLeft, sheetHeight + holeTop, holeWidth, holeWidth, holeWidth / 2);
        }

        api.setItemHorizontalAlignment(textAlign);
        api.setItemVerticalAlignment(1);
        // sheet1
        if (data.text1)
            api.drawText(data.text1, header + marginH, marginV, textWidth, textHeight, fontName, fontSize, fontStyle);
        // sheet2
        if (param.reverse)
            api.setItemOrientation(180);
        if (data.text2)
            api.drawText(data.text2, header + marginH, sheetHeight + marginV, textWidth, textHeight, fontName, fontSize, fontStyle);

        return api.commitJob();
    }
};
