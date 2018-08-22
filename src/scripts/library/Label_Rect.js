var PrintUtils = require('../PrintUtils');
var config = require('../Config');

module.exports = {
    print: function (api, data, param) {
        var width = (param.width ? param.width - 1 : 0);
        var height = param.height;
        var orientation = (typeof param.orientation === "number" ? param.orientation : PrintUtils.getOrientation());
        var header = param.header || 0;
        var marginH = param.margin || 3;
        var marginV = param.marginV || 1;
        var marginLeft = param.marginLeft || marginH;
        var marginRight = param.marginRight || marginH;
        var offsetX = param.offsetX || 0;
        var offsetY = param.offsetY || 0;

        var fontName = param.fontName;
        var fontSize = param.fontSize || 5;
        var fontStyle = param.fontStyle || 0;
        var textAlign = param.textAlign || 0;
        var verticalAlign = (typeof param.verticalAlign === "number" ? param.verticalAlign : 1);// 默认垂直居中；

        var titleSize = param.titleSize || fontSize;
        var titleStyle = (typeof param.titleStyle === "number" ? param.titleStyle : 1);// 标题默认显示粗体
        var titleAlign = (typeof param.titleAlign === "number" ? param.titleAlign : 0);// 标题默认左对齐

        var logoWidth = param.logoWidth || 0;
        var qrcodeWidth = param.qrcodeWidth || 0;
        var qrcodeTextHeight = param.qrcodeTextHeight || 0;
        var qrcodeTop = param.qrcodeTop || header + (height - header - qrcodeWidth - qrcodeTextHeight) / 2;
        // 如果未指定二维码字符串高度，则将二维码下面的区域用于显示二维码字符串；
        qrcodeTextHeight = qrcodeTextHeight || (qrcodeTop - qrcodeWidth);

        // 当二维码字符串需要居中显示的时候，二维码相对于qrcodeText缩进的宽度；
        var qrcodePadding = (typeof param.qrcodePadding === "number" ? param.qrcodePadding : 0);

        // qrcodeText相关参数；
        var qrcodeText = data.qrcodeText || data.qrcode;
        var qrcodeTextSize = param.qrcodeTextSize || 3;
        var qrcodeTextWidth = param.qrcodeTextWidth || (qrcodeWidth + qrcodePadding * 2);
        // 二维码字符串的对齐方式，默认靠右对齐；
        var qrcodeTextAlign = (typeof param.qrcodeTextAlign === "number" ? param.qrcodeTextAlign : 1);

        var qrcode = data.qrcode;
        var textArray = data.textArray || [];
        var text = data.text || textArray.join("\n");

        if (!api.startJob(offsetX + width, offsetY + height, orientation))
            return false;

        if (config.DEBUG) {
            api.drawRectangle(offsetX, offsetY, width, height);
            if (header)
                api.drawDashLine2(offsetX, offsetY + header, offsetX + width, offsetY + header);
            api.drawRectangle(offsetX + width - marginRight - qrcodeWidth - qrcodePadding, offsetY + qrcodeTop, qrcodeWidth, qrcodeWidth);
        }

        // 1、打印标题信息;
        api.setItemHorizontalAlignment(titleAlign);
        api.setItemVerticalAlignment(1);
        if (data.title) {
            api.drawText(data.title, offsetX + logoWidth, offsetY, width - logoWidth - marginH, header, fontName, titleSize, titleStyle);
        }
        // 2、打印主体信息;
        api.setItemHorizontalAlignment(textAlign);
        api.setItemVerticalAlignment(verticalAlign);
        if (text) {
            api.drawText(text, offsetX + marginLeft, offsetY + header + marginV, width - marginLeft - marginRight - marginH * 0.5 - qrcodeWidth - qrcodePadding * 2, height - header - marginV * 2, fontName, fontSize, fontStyle);
        }
        if (qrcode) {
            api.setItemHorizontalAlignment(qrcodeTextAlign);
            api.setItemVerticalAlignment(1);
            api.draw2DQRCode(qrcode, offsetX + width - marginRight - qrcodeWidth - qrcodePadding, offsetY + qrcodeTop, qrcodeWidth);
            if (param.showQrcodeText && qrcodeText) {
                api.drawText(qrcodeText, offsetX + width - marginRight - qrcodeTextWidth, offsetY + qrcodeTop + qrcodeWidth, qrcodeTextWidth, qrcodeTextHeight, fontName, qrcodeTextSize, fontStyle);
            }
        }

        return api.commitJob();
    },
    preview: function (data, param) {
        // param
        param = param || {};

        // data
        var textArray = data.textArray || [];
        var qrcodeText = param.showQrcodeText ? data.qrcodeText || data.qrcode : "";
        var title = data.title || "";
        var text = data.text || textArray.join("<br>");

        var html = '';
        html += '<div class="label label-{{labelStyle}}" style="font-size: {{fontSize}};background-color: {{background}};color: {{color}};font-weight: {{fontWeight}};">';
        html += '   <div class="label-{{labelStyle}}-header" style="font-size: {{titleSize}};background-color: {{headerBackground}};color: {{headerColor}};">';
        html += '       <div class="label-{{labelStyle}}-header-logo {{logo}}"></div>';
        html += '       <div class="label-{{labelStyle}}-header-title label-center-v" style="font-weight: {{titleWeight}}";>';
        html += '           <div class="label-cell"><div class="label-cell-content label-auto-shrink">{{title}}</div></div>';
        html += '       </div>';
        html += '   </div>';
        html += '   <div class="label-{{labelStyle}}-body" style="line-height: {{lineHeight}};text-align: {{textAlign}};">';
        html += '       <div class="label-{{labelStyle}}-body-text label-center-v">';
        html += '           <div class="label-cell"><div class="label-cell-content label-auto-shrink">{{text}}</div></div>';
        html += '       </div>';
        html += '       <div class="label-{{labelStyle}}-body-qrcode label-qrcode" data-qrcode="{{qrcode}}"></div>';
        html += '       <div class="label-{{labelStyle}}-body-qrcode-text">{{qrcodeText}}</div>';
        html += '   </div>';
        html += '</div>';

        return PrintUtils.buildTmp(html, {
            // data
            title: title,
            text: text,
            qrcode: data.qrcode,
            qrcodeText: qrcodeText,
            // param
            labelStyle: param.labelStyle,
            // logo: param.logo || "label-icon-chinanet-h",
            logo: param.logo || "label-icon-cmcc-h",
            fontSize: param.fontSize || "5mm",
            titleSize: (param.titleSize || param.fontSize || "5mm"),
            background: param.background || "white",
            color: param.color || "black",
            headerBackground: param.headerBackground || "",
            headerColor: param.headerColor || "black",
            lineHeight: param.lineHeight,
            textAlign: param.textAlign || "left",
            fontWeight: param.fontWeight || "normal",
            titleWeight : param.titleWeight || "bold"
        });
    }
};
