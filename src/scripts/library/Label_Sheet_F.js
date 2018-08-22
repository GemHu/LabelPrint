var PrintUtils = require('../PrintUtils');
var config = require('../Config');

module.exports = {
    printQrcode: function (api, data, param) {
        var orientation = (typeof param.orientation === "number" ? param.orientation : PrintUtils.getOrientation());
        var width = (param.width ? param.width - 1 : 0);
        var height = param.height || 0;
        var sheetCount = param.sheetCount || 2;
        var tail = param.tail || 0;
        var sheetWidth = width - tail;
        var sheetHeight = height / sheetCount;
        var margin = param.margin || 1;
        var marginH = param.marginH || margin;
        var marginV = param.marginV || margin;
        var logoWidth = param.showLogo ? (param.logoWidth || 4.5) : marginH;
        var itemHeight = sheetHeight - marginV * 2;
        var qrcodeTextHeight = param.showQRCodeText ? (param.qrcodeTextHeight || sheetHeight * 0.15) : 0;
        var qrcodeWidth = itemHeight - qrcodeTextHeight;
        var offsetX = param.offsetX || 0;
        var offsetY = param.offsetY || 0;
        var fontSize = param.fontSize || 3.0;
        var codeInLeft = param.codeInLeft || param.qrcodeInLeft;
        var fontName = param.fontName;
        var fontStyle = param.fontStyle;
        var textAlign = param.textAlign || 0;
        var verticalAlign = (typeof param.verticalAlign === "number" ? param.verticalAlign : 1);
        var textAlign1 = (typeof param.textAlign1 === "number" ? param.textAlign1 : textAlign);
        var textAlign2 = (typeof param.textAlign2 === "number" ? param.textAlign2 : textAlign);
        var verticalAlign1 = (typeof param.verticalAlign1 === "number" ? param.verticalAlign1 : verticalAlign);
        var verticalAlign2 = (typeof param.verticalAlign2 === "number" ? param.verticalAlign2 : verticalAlign);
        var textWidth = sheetWidth - logoWidth - marginH * 1.5 - itemHeight;
        // 二维码传字体太小了，所以需要对二维码串进行微调；
        var adjust = marginV;

        if (!api.startJob(width, height, orientation))
            return false;

        if (config.DEBUG) {
            api.drawRectangle(offsetX, offsetY, sheetWidth, height);
            api.drawDashLine2(offsetX, offsetY + sheetHeight, sheetWidth, offsetY + sheetHeight);
            if (sheetCount === 3) {
                api.drawDashLine2(offsetX, offsetY + sheetHeight * 2, sheetWidth, offsetY + sheetHeight * 2);
            }
        }

        api.setItemHorizontalAlignment(0);
        api.setItemVerticalAlignment(1);
        api.setItemOrientation(0);
        // 第一折
        if (data.text1 && data.code1) {
            if (codeInLeft) {
                // 二维码显示在左侧
                api.draw2DQRCode(data.code1, offsetX + logoWidth, offsetY + marginV, qrcodeWidth);
                api.drawText(data.text1, offsetX + sheetWidth - marginH - textWidth, offsetY + marginV, textWidth, qrcodeWidth, fontName, fontSize, fontStyle);
                if (param.showQRCodeText)
                    api.drawText(data.code1, offsetX + logoWidth, offsetY + marginV + qrcodeWidth, sheetWidth - logoWidth - marginH, qrcodeTextHeight + adjust, fontName, fontSize, fontStyle);
            } else {
                api.drawText(data.text1, offsetX + logoWidth, offsetY + marginV, textWidth, qrcodeWidth, fontName, fontSize, fontStyle);
                api.setItemHorizontalAlignment(2);
                api.draw2DQRCode(data.code1, offsetX + sheetWidth - marginH - qrcodeWidth, offsetY + marginV, qrcodeWidth);
                if (param.showQRCodeText)
                    api.drawText(data.code1, offsetX + logoWidth, offsetY + marginV + qrcodeWidth, sheetWidth - logoWidth - marginH, qrcodeTextHeight + adjust, fontName, fontSize, fontStyle);
            }
        } else if (data.text1) {
            api.setItemHorizontalAlignment(textAlign1);
            api.setItemVerticalAlignment(verticalAlign1);
            api.drawText(data.text1, offsetX + logoWidth, offsetY + marginV, sheetWidth - logoWidth - marginH, itemHeight, fontName, fontSize, fontStyle);
        } else if (data.code1) {
            api.setItemHorizontalAlignment(1);
            api.draw2DQRCode(data.code1, offsetX + (sheetWidth - qrcodeWidth) / 2, offsetY + marginV, qrcodeWidth);
            if (param.showQRCodeText)
                api.drawText(data.code1, offsetX + logoWidth, offsetY + marginV + qrcodeWidth, sheetWidth - logoWidth * 2, qrcodeTextHeight, fontName, qrcodeTextHeight, fontStyle);
        }

        // 第二折
        api.setItemHorizontalAlignment(0);
        api.setItemVerticalAlignment(1);
        api.setItemOrientation(180);
        if (data.text2 && data.code2) {
            if (codeInLeft) {
                // 旋转后显示到右侧；
                api.drawText(data.text2, offsetX + marginH, offsetY + sheetHeight + marginV + qrcodeTextHeight, textWidth, qrcodeWidth, fontName, fontSize, fontStyle);
                api.draw2DQRCode(data.code2, offsetX + sheetWidth - logoWidth - qrcodeWidth, offsetY + sheetHeight + marginV + qrcodeTextHeight, qrcodeWidth);
                if (param.showQRCodeText)
                    api.drawText(data.code2, offsetX + marginH, offsetY + sheetHeight + marginV, sheetWidth - marginH - logoWidth, qrcodeTextHeight, fontName, qrcodeTextHeight, fontStyle);
            } else {
                api.drawText(data.text2, offsetX + sheetWidth - logoWidth - textWidth, offsetY + sheetHeight + marginV + qrcodeTextHeight, textWidth, qrcodeWidth, fontName, fontSize, fontStyle);
                api.setItemHorizontalAlignment(2);
                api.draw2DQRCode(data.code2, offsetX + marginH, offsetY + sheetHeight + marginV + qrcodeTextHeight, qrcodeWidth);
                if (param.showQRCodeText)
                    api.drawText(data.code2, offsetX + marginH, offsetY + sheetHeight + marginV - adjust, sheetWidth - logoWidth - marginH, qrcodeTextHeight + adjust, fontName, fontSize, fontStyle);
            }
        } else if (data.text2) {
            api.setItemHorizontalAlignment(textAlign2);
            api.setItemVerticalAlignment(verticalAlign2);
            api.drawText(data.text2, offsetX + marginH, offsetY + sheetHeight + marginV, sheetWidth - marginH - logoWidth, itemHeight, fontName, fontSize, fontStyle);
        } else if (data.code2) {
            api.setItemHorizontalAlignment(1);
            api.draw2DQRCode(data.code2, offsetX + (sheetWidth - qrcodeWidth) / 2, offsetY + sheetHeight + marginV + qrcodeTextHeight, qrcodeWidth);
            if (param.showQRCodeText)
                api.drawText(data.code2, offsetX + logoWidth, offsetY + sheetHeight + marginV - adjust, sheetWidth - logoWidth * 2, qrcodeTextHeight + adjust, fontName, fontSize, fontStyle);
        }

        return api.commitJob();
    },
    print: function (api, data, param) {
        return this.printQrcode(api, data, param);
    },
    printBarcode: function (api, data, param) {
        var orientation = (typeof param.orientation === "number" ? param.orientation : PrintUtils.getOrientation());
        var width = (param.width ? param.width - 1 : 0);
        var height = param.height || 0;
        var sheetCount = param.sheetCount || 2;
        var tail = param.tail || 0;
        var sheetWidth = width - tail;
        var sheetHeight = height / sheetCount;
        var margin = param.margin || 1;
        var marginH = param.marginH || margin;
        var marginV = param.marginV || margin;
        var logoWidth = param.showLogo ? (param.logoWidth || 4.5) : marginH;
        var itemHeight = sheetHeight - marginV * 2;
        var offsetX = param.offsetX || 0;
        var offsetY = param.offsetY || 0;
        var fontSize = param.fontSize || 3.0;
        var fontName = param.fontName;
        var fontStyle = param.fontStyle;
        var barcodeFontSize = (typeof param.barcodeFontSize === "number" ? param.barcodeFontSize : 3);
        var textWidth = sheetWidth - logoWidth - marginH * 1.5 - itemHeight;

        if (!api.startJob(width, height, orientation))
            return false;

        if (Config.DEBUG) {
            api.drawRectangle(offsetX, offsetY, sheetWidth, height);
            api.drawDashLine2(offsetX, offsetY + sheetHeight, sheetWidth, offsetY + sheetHeight);
            if (sheetCount === 3) {
                api.drawDashLine2(offsetX, offsetY + sheetHeight * 2, sheetWidth, offsetY + sheetHeight * 2);
            }
        }

        api.setItemHorizontalAlignment(0);
        api.setItemVerticalAlignment(1);
        api.setItemOrientation(0);
        // 第一折
        if (data.code1) {
            api.draw1DBarcode(data.code1, 60, offsetX + logoWidth, offsetY + marginV, sheetWidth - logoWidth - marginH, itemHeight, barcodeFontSize);
        } else if (data.text1) {
            api.drawText(data.text1, offsetX + logoWidth, offsetY + marginV, sheetWidth - logoWidth - marginH, itemHeight, fontName, fontSize, fontStyle);
        }

        // 第二折
        api.setItemOrientation(180);
        if (data.code2) {
            api.draw1DBarcode(data.code2, 60, offsetX + marginH, offsetY + marginV + sheetHeight, sheetWidth - logoWidth - marginH, itemHeight, barcodeFontSize);
        } else if (data.text2) {
            api.drawText(data.text2, offsetX + marginH, offsetY + sheetHeight + marginV, sheetWidth - marginH - logoWidth, itemHeight, fontName, fontSize, fontStyle);
        }

        return api.commitJob();
    },
    previewQrcode: function (data, param) {
        data = data || {};
        param = param || {};
        var width = 100;
        var height = 100;
        param.fontSize = param.fontSize || "3.5mm";
        param.labelStyle = param.labelStyle || "L-45-30-50";
        param.background = param.background || "#FFFFFF";
        param.borderColor = param.borderColor || "darkgray";
        param.marginH = param.marginH || 3;
        param.marginV = param.marginV || 10;
        param.logoWidth = (param.showLogo ? (param.logoWidth ? param.logoWidth : 16) : param.marginH);
        param.showLogo = (param.showLogo ? "block" : "none");
        param.itemHeight = height - param.marginV * 2;
        param.qrcodeWidth = param.qrcodeWidth || 25;
        param.logo = param.logo || "label-icon-chinanet-logo";
        param.textAlign = param.textAlign || "left";
        param.textAlign1 = param.textAlign1 || param.textAlign;
        param.textAlign2 = param.textAlign2 || param.textAlign;
        param.codeInLeft = param.codeInLeft || param.qrcodeInLeft;
        //
        param.code1 = data.code1 || "";
        param.code2 = data.code2 || "";
        param.text1 = data.text1 || "";
        param.text2 = data.text2 || "";
        //
        param.codeLeft1 = param.qrcodeWidth1 = param.textLeft1 = param.textWidth1 = 0;
        param.codeLeft2 = param.qrcodeWidth2 = param.textLeft2 = param.textWidth2 = 0;
        param.textTop1 = param.textTop2 = param.marginV;
        // Start： 二维码字符串相关变量
        param.codeText1 = param.showQRCodeText ? param.code1 : "";
        param.codeText2 = param.showQRCodeText ? param.code2 : "";
        param.itemHeight1 = param.itemHeight2 = param.itemHeight;
        param.codeTextHeight1 = param.codeTextHeight2 = 0;
        if (param.showQRCodeText) {
            if (data.code1) {
                param.codeTextHeight1 = param.itemHeight * 0.1 + param.marginV;
                param.itemHeight1 = param.itemHeight * 0.9;
            }
            if (data.code2) {
                param.codeTextHeight2 = param.itemHeight * 0.1 + param.marginV;
                param.itemHeight2 = param.itemHeight * 0.9;
                param.textTop2 = param.codeTextHeight2;
            }
        }
        param.codeTextLeft1 = param.codeTextLeft2 = 0;
        param.codeTextWidth1 = param.codeTextWidth2 = 0;
        param.codeTextTop1 = param.codeTextTop2 = 0;
        param.codeTextAlign1 = param.codeTextAlign2 = "right";

        param.codeTextTop1 = param.marginV + param.itemHeight1;
        // sheet1
        if (data.text1 && data.code1) {
            param.textWidth1 = width - param.logoWidth - param.qrcodeWidth - param.marginH * 1.5;
            param.qrcodeWidth1 = param.qrcodeWidth;
            if (param.codeInLeft) {
                param.codeLeft1 = param.logoWidth;
                param.textLeft1 = width - param.marginH - param.textWidth1;
            } else {
                param.codeLeft1 = width - param.marginH - param.qrcodeWidth1;
                param.textLeft1 = param.logoWidth;
            }
            param.codeTextLeft1 = param.logoWidth;
            param.codeTextWidth1 = width - param.logoWidth - param.marginH;
        } else if (data.text1) {
            param.textLeft1 = param.logoWidth;
            param.textWidth1 = width - param.logoWidth - param.marginH;
        } else if (data.code1) {
            param.codeLeft1 = (width - param.qrcodeWidth) / 2;
            param.qrcodeWidth1 = param.qrcodeWidth;
            param.codeTextAlign1 = "center";
            param.codeTextLeft1 = 0;
            param.codeTextWidth1 = param.width;
        }
        // sheet2
        if (data.text2 && data.code2) {
            param.qrcodeWidth2 = param.qrcodeWidth;
            param.textWidth2 = width - param.logoWidth - param.qrcodeWidth - param.marginH * 1.5;
            // 180度旋转后，二维码显示到右侧
            if (param.codeInLeft) {
                param.codeLeft2 = width - param.logoWidth - param.qrcodeWidth;
                param.textLeft2 = param.marginH;
            } else {
                param.codeLeft2 = param.marginH;
                param.textLeft2 = width - param.logoWidth - param.textWidth2;
            }
            param.codeTextLeft2 = param.marginH;
            param.codeTextWidth2 = width - param.logoWidth - param.marginH;
        } else if (data.text2) {
            param.textWidth2 = width - param.logoWidth - param.marginH;
            param.textLeft2 = param.marginH;
        } else if (data.code2) {
            param.codeLeft2 = (width - param.qrcodeWidth) / 2;
            param.qrcodeWidth2 = param.qrcodeWidth;
            param.codeTextAlign2 = "center";
            param.codeTextLeft2 = 0;
            param.codeTextWidth2 = param.width;
        }

        var html = '';
        html += '<div class="label label-{{labelStyle}}" style="font-size: {{fontSize}};">';
        // sheet1
        html += '   <div class="label-{{labelStyle}}-sheet1" style="background-color: {{background}};border-color: {{borderColor}};">';
        html += '       <div class="label-{{labelStyle}}-logo-lt {{logo}}" style="display: {{showLogo}}"></div>';
        html += '       <div class="label-qrcode" data-qrcode="{{code1}}" style="left: {{codeLeft1}}%;width: {{qrcodeWidth1}}%;top: {{textTop1}}%;height: {{itemHeight1}}%;"></div>';
        html += '       <div style="left:{{codeTextLeft1}}%;width:{{codeTextWidth1}}%;top:{{codeTextTop1}}%;Height:{{codeTextHeight1}}%;text-align:{{codeTextAlign1}};font-size:2.5mm;">{{codeText1}}</div>';
        // text1
        html += '       <div class="label-center-v" style="left: {{textLeft1}}%;width: {{textWidth1}}%;top: {{textTop1}}%;height: {{itemHeight1}}%;text-align: {{textAlign1}};">';
        html += '           <div class="label-cell"><div class="label-cell-content label-auto-shrink">{{text1}}</div></div>';
        html += '       </div>';
        html += '   </div>';
        // sheet2
        html += '   <div class="label-{{labelStyle}}-sheet2" style="background-color: {{background}};border-color: {{borderColor}};">';
        html += '       <div class="label-{{labelStyle}}-logo-rb label-rotate-180 {{logo}}" style="display: {{showLogo}}"></div>';
        html += '       <div class="label-qrcode label-rotate-180" data-qrcode="{{code2}}" style="left: {{codeLeft2}}%;width: {{qrcodeWidth2}}%;top: {{textTop2}}%;height: {{itemHeight2}}%;"></div>';
        html += '       <div class="label-rotate-180" style="left:{{codeTextLeft2}}%;width:{{codeTextWidth2}}%;top:{{codeTextTop2}}%;Height:{{codeTextHeight2}}%;text-align:{{codeTextAlign2}};font-size:2.5mm;">{{codeText2}}</div>';
        html += '       <div class="label-center-v label-rotate-180" style="left: {{textLeft2}}%;width: {{textWidth2}}%;top: {{textTop2}}%;height: {{itemHeight2}}%;text-align: {{textAlign2}};">';
        html += '           <div class="label-cell"><div class="label-cell-content label-auto-shrink">{{text2}}</div></div>';
        html += '       </div>';
        html += '   </div>';
        // sheet3
        if (/^T-/i.test(param.labelStyle)) {
            html += '   <div class="label-{{labelStyle}}-sheet3" style="background-color: {{background}};border-color: {{borderColor}};"></div>';
        }
        // tail
        html += '   <div class="label-{{labelStyle}}-tail" style="background-color: {{background}};border-color: {{borderColor}};"></div>';
        html += '</div>';

        return PrintUtils.buildTmp(html, param);
    },
    preview: function (data, param) {
        return this.previewQrcode(data, param);
    },
    previewBarcode: function (data, param) {
        data = data || {};
        param = param || {};
        var width = 100;
        var height = 100;
        param.textAlign = param.textAlign || "left";
        param.fontSize = param.fontSize || "3.5mm";
        param.barcodeTextHeight = param.barcodeTextHeight || 25;
        param.barcodeFontSize = param.barcodeFontSize || "3mm";
        param.labelStyle = param.labelStyle || "L-45-30-50";
        param.background = param.background || "#FFFFFF";
        param.borderColor = param.borderColor || "darkgray";
        param.marginH = param.marginH || 3;
        param.marginV = param.marginV || 10;
        param.logoWidth = (param.showLogo ? (param.logoWidth ? param.logoWidth : marginH) : param.marginH);
        param.itemHeight = height - param.marginV * 2;
        //
        param.code1 = data.code1 || "";
        param.code2 = data.code2 || "";
        param.text1 = data.text1 || "";
        param.text2 = data.text2 || "";
        //
        param.codeLeft1 = param.codeWidth1 = param.textLeft1 = param.textWidth1 = 0;
        param.codeLeft2 = param.codeWidth2 = param.textLeft2 = param.textWidth2 = 0;
        param.codeTop1 = param.textTop1 = param.codeTop2 = param.textTop2 = param.marginV;
        param.codeHeight1 = param.textHeight1 = param.codeHeight2 = param.textHeight2 = param.itemHeight;
        param.textAlign1 = param.textAlign2 = param.textAlign;
        // sheet1
        if (param.code1) {
            param.text1 = param.code1;
            param.codeLeft1 = param.textLeft1 = param.logoWidth;
            param.codeWidth1 = param.textWidth1 = width - param.logoWidth - param.marginH;
            param.textHeight1 = param.barcodeTextHeight;
            param.textTop1 = height - param.marginV - param.barcodeTextHeight;
            param.codeHeight1 = param.itemHeight - param.textHeight1;
            param.textAlign1 = "center";
        } else if (param.text1) {
            param.textLeft1 = param.logoWidth;
            param.textWidth1 = width - param.logoWidth - param.marginH;
        }
        // sheet2
        if (param.code2) {
            param.text2 = param.code2;
            param.codeLeft2 = param.textLeft2 = param.marginH;
            param.codeWidth2 = param.textWidth2 = width - param.logoWidth - param.marginH;
            param.textHeight2 = param.barcodeTextHeight;
            param.codeTop2 = param.marginV + param.barcodeTextHeight;
            param.codeHeight2 = param.itemHeight - param.textHeight2;
            param.textAlign2 = "center";
        } else if (param.text2) {
            param.textLeft2 = param.marginH;
            param.textWidth2 = width - param.logoWidth - param.marginH;
        }

        var html = '';
        html += '<div class="label label-{{labelStyle}}" style="font-size: {{fontSize}};">';
        // sheet1
        html += '   <div class="label-{{labelStyle}}-sheet1" style="background-color: {{background}};border-color: {{borderColor}};">';
        html += '       <div class="label-barcode" data-barcode="{{code1}}" style="left: {{codeLeft1}}%;width: {{codeWidth1}}%;top: {{codeTop1}}%;height: {{codeHeight1}}%;"></div>';
        // text1
        html += '       <div class="label-center-v" style="left: {{textLeft1}}%;width: {{textWidth1}}%;top: {{textTop1}}%;height: {{textHeight1}}%;text-align: {{textAlign1}};">';
        html += '           <div class="label-cell"><div class="label-cell-content">{{text1}}</div></div>';
        html += '       </div>';
        html += '   </div>';
        // sheet2
        html += '   <div class="label-{{labelStyle}}-sheet2" style="background-color: {{background}};border-color: {{borderColor}};">';
        // qrcodeLeft2
        html += '       <div class="label-barcode label-rotate-180" data-barcode="{{code2}}" style="left: {{codeLeft2}}%;width: {{codeWidth2}}%;top: {{codeTop2}}%;height: {{codeHeight2}}%;"></div>';
        html += '       <div class="label-center-v label-rotate-180" style="left: {{textLeft2}}%;width: {{textWidth2}}%;top: {{textTop2}}%;height: {{textHeight2}}%;text-align: {{textAlign2}}">';
        html += '           <div class="label-cell"><div class="label-cell-content">{{text2}}</div></div>';
        html += '       </div>';
        html += '   </div>';
        // sheet3
        if (/^T-/i.test(param.labelStyle)) {
            html += '   <div class="label-{{labelStyle}}-sheet3" style="background-color: {{background}};border-color: {{borderColor}};"></div>';
        }
        // tail
        html += '   <div class="label-{{labelStyle}}-tail" style="background-color: {{background}};border-color: {{borderColor}};"></div>';
        html += '</div>';

        return PrintUtils.buildTmp(html, param);
    }
};
