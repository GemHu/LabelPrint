var config = require('../Config');
var printUtils = require('../PrintUtils');

module.exports = {
    preview: function (data, param) {
        param = param || {};
        var textArray = data.textArray || [];
        var text = data.text || textArray.join('');

        var fontSize = param.fontSize || "8mm";
        var html = '' +
            '<div class="label label-15-20" style="font-size: {{fontSize}};">' +
            '   <div class="label-center-v" style="text-align: center;">' +
            '       <div class="label-cell"><div class="label-cell-content">{{text}}</div></div>' +
            '   </div>' +
            '</div>';

        return printUtils.buildTmp(html, {
            text: text,
            fontSize: fontSize
        });
    },
    print: function (api, data, param) {
        param = param || {};
        var textArray = data.textArray || [];
        var text = data.text || textArray.join('');

        var width = 20;
        var height = 15;
        var marginH = 1.5;
        var marginV = 1.0;
        var fontName = param.fontName;
        var fontSize = param.fontSize || 6;
        var fontStyle = typeof param.fontStyle === "number" ? param.fontStyle : 1;

        if (!api.startJob(width, height, 0))
            return false;

        if (config.DEBUG) {
            api.drawRoundRectangle(0, 0, width, height);
        }

        api.setItemHorizontalAlignment(1);
        api.setItemVerticalAlignment(1);
        if (text)
            api.drawText(text, marginH, marginV, width - marginH * 2, height - marginV * 2, fontName, fontSize, fontStyle);

        return api.commitJob();
    },
    previewDouble : function (data, param) {
        param = param || {};
        var textArray = data.textArray || [];
        var text = data.text || textArray.join('');

        var fontSize = "8mm";
        var html = '' +
            '<div class="label label-15-20-D" style="font-size: {{fontSize}};text-align: center;">' +
            '   <div class="label-15-20-D-sheet1 label-center-v">' +
            '       <div class="label-cell"><div class="label-cell-content">{{text1}}</div></div>' +
            '   </div>' +
            '   <div class="label-15-20-D-sheet2 label-center-v">' +
            '       <div class="label-cell"><div class="label-cell-content">{{text2}}</div></div>' +
            '   </div>' +
            '</div>';

        return printUtils.buildTmp(html, {
            text1: text,
            text2: text,
            fontSize: fontSize
        });
    },
    printDouble : function (api, data, param) {
        param = param || {};
        var textArray = data.textArray || [];
        var text = data.text || textArray.join('');

        var sheetWidth = 20;
        var sheetHeight = 15;
        var padding = 2;
        var width = sheetWidth * 2 + padding;
        var height = sheetHeight;
        var marginH = 1.5;
        var marginV = 1.0;
        var fontName = param.fontName;
        var fontSize = param.fontSize || 6;
        var fontStyle = typeof param.fontStyle === "number" ? param.fontStyle : 1;

        if (!api.startJob(width, height, 0))
            return false;

        api.setItemHorizontalAlignment(1);
        api.setItemVerticalAlignment(1);
        for (var i = 0; i < 2; i++) {
            if (config.DEBUG) {
                api.drawRoundRectangle((sheetWidth + padding) * i, 0, sheetWidth, sheetHeight);
            }

            if (text) {
                api.drawText(text, (sheetWidth + padding) * i + marginH, marginV, sheetWidth - marginH * 2, sheetHeight - marginV * 2, fontName, fontSize, fontStyle);
            }

        }
        return api.commitJob();
    }
};
