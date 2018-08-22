// 常用标签模板库；
// var LabelLibrary = require('./library/LabelLibrary');
// 相关配置信息；
var config = require('./Config');
var PrintUtils = require('./PrintUtils');
var label_85_140 = require('./library/Label_Rect_85_140');
var label_45_100 = require('./library/Label_Rect_45_100');
var label_30_90 = require('./library/Label_Rect_30_90');
var label_45_60 = require('./library/Label_Fold_45_60_H');
var label_38_25 = require('./library/Label_F_38_25_40');
var label_54_86 = require('./library/Label_Card_54_86');
var label_15_20 = require('./library/Label_Rect_15_20');

module.exports = {
    updatePrintType: function (printType) {
        printType = printType || "";
        try {
            // 先去掉字符串两端的空格；
            printType = printType.replace(/(^\s*)|(\s*$)/g, "");
            // 其他为设备标签，不做特殊处理；
        } catch (e) {
        }

        return printType;
    },
    getLabel: function (printType, data) {
        // 忽略大小写；
        if (printType)
            printType = printType.toUpperCase();

        switch (printType) {
            case "TCM85_140":
            case "TCM85_140_H":
                return new Template1(data);
            case "TCM100_45":
            case "TCM100_45_FDJ":
                return new Template2(data);
            case "TCM90_30":
            case "TCM90_30_1":
                return new Template3(data);
            case "TCM90_30_ONU":
            case "TCM90_30_JKSB":
                return new Template4(data);
            case "GB45_60":
            case "GB45_60_L":
            case "GB45_60_A":
                return new Template5(data);
            case "QS_02F":
            case "QS_02F_S":
                return new Template6(data);
            case "TCM85_54":
                return new Template7(data);
            case "P15_10":
            case "P20_15":
            case "D_print":
                return new Template8(data);
            case "TCM100_45_GJ":
            case "TCM85_140_FWK":
                return new Template2(data);
            default:
                return PrintUtils.buildTmp('<div style="color: red;font-size: 5mm;">不支持标签类型：{{printType}}</div>', {
                    printType: data.oldPrintType
                });
        }
    }
};

function Template1(data) {
    PrintUtils.showOrientation();
    var textArray = data.textArray || [];

    return {
        preview: function (container) {
            return label_85_140.preview({
                title : textArray[0],
                text : textArray.slice(1).join('<br>'),
                qrcode : data.qrcode
            });
        }, print: function (api) {
            return label_85_140.print(api, {
                title : textArray[0],
                text : textArray.slice(1).join('\n'),
                qrcode : data.qrcode
            });
        }
    }
}

/**
 * 接入网、核心网等设备或光缆标签；
 * 标签大小：SP50-90
 */
function Template2(data) {
    PrintUtils.showOrientation();
    var textArray = data.textArray || [];

    return {
        preview: function (container) {
            return label_45_100.preview({
                title : textArray[0],
                text : textArray.slice(1).join('<br>'),
                qrcode : data.qrcode
            });
        }, print: function (api) {
            return label_45_100.print(api, {
                title : textArray[0],
                text : textArray.slice(1).join('\n'),
                qrcode : data.qrcode
            });
        }
    }
}

function Template3(data) {
    PrintUtils.showOrientation();
    var textArray = data.textArray || [];

    return {
        preview : function (container) {
            return label_30_90.preview({
                title : textArray[0],
                text : textArray.slice(1).join('<br>'),
                qrcode : data.qrcode
            });
        },
        print : function (api) {
            return label_30_90.print(api, {
                title : textArray[0],
                text : textArray.slice(1).join('\n'),
                qrcode : data.qrcode
            })
        }
    }
}

function Template4(data) {
    PrintUtils.showOrientation();
    var textArray = data.textArray || [];

    return {
        preview : function (container) {
            return label_30_90.preview({
                text : textArray.join('<br>'),
                qrcode : data.qrcode
            });
        },
        print : function (api) {
            return label_30_90.print(api, {
                text : textArray.join('\n'),
                qrcode : data.qrcode
            })
        }
    }
}

function Template5(data) {
    PrintUtils.showOrientation();
    var textArray = data.textArray || [];

    return {
        preview : function (container) {
            return label_45_60.preview({
                text1 : textArray[0],
                text2 : textArray.slice(1).join('<br>'),
                qrcode1 : data.qrcode
            }, {
                textAlign2 : "left",
                qrcodeTextHeight : 5
            });
        },
        print : function (api) {
            return label_45_60.print(api, {
                text1 : textArray[0],
                text2 : textArray.slice(1).join('<br>'),
                qrcode1 : data.qrcode
            }, {
                textAlign2 : 0,
                fontSize : 3,
                qrcodeTextHeight: 3
            });
        }
    }
}

function Template6(data) {
    PrintUtils.showOrientation();
    var textArray = data.textArray || [];

    return {
        preview : function (container) {
            return label_38_25.preview({
                text1 : textArray.slice(0, 2).join('<br>'),
                text2 : textArray.slice(2, 4).join('<br>')
            }, {
                textAlign : "center"
            })
        },
        print : function (api) {
            return label_38_25.print(api, {
                text1 : textArray.slice(0, 2).join('\n'),
                text2 : textArray.slice(2, 4).join('\n')
            }, {
                textAlign : 1
            });
        }
    }
}

function Template7(data) {
    PrintUtils.showOrientation();
    var textArray = data.textArray || [];

    return {
        preview : function (container) {
            return label_54_86.preview(data, {
                showLogo : false
            });
        },
        print : function (api) {
            return label_54_86.print(api, data, {

            });
        }
    }
}

/**
 * ODM/DDM
 */
function Template8(data) {
    PrintUtils.setCurrType("SP15-20").showCurrType();
    PrintUtils.setOrientation(2).showOrientation();
    var textArray = data.textArray || [];

    return {
        preview : function (container) {
            return label_15_20.previewDouble(data);
        },
        print : function (api) {
            return label_15_20.printDouble(api, data);
        }
    }
}

/**
 * 字体大小对照表；
 */
var FontSizes = {
    YiYingCun: 25.30,
    DaTeHao: 22.14,
    TeHao: 18.97,
    ChuHao: 14.82,
    XiaoChu: 12.70,
    YiHao: 9.17,
    XiaoYi: 8.47,
    ErHao: 7.76,
    XiaoEr: 6.35,
    SanHao: 5.64,
    XiaoSan: 5.29,
    SiHao: 4.94,
    XiaoSi: 4.23,
    WuHao: 3.70,
    XiaoWu: 3.18,
    LiuHao: 2.56,
    XiaoLiu: 2.29,
    QiHao: 1.94,
    BaHao: 1.76
};
