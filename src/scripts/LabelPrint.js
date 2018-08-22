var LPAPI = require('./LPAPI');
// 接口相关工具类；
var PrintUtils = require('./PrintUtils');
// 接口中所用到的所有标签模板；
var factory = require('./Templates');

var Tags = {
    Print: "Print",
    PrintType: "LabelType",
    Code: "Code",
    Text: "Text",
    Title: "Title"
};

function LabelPrint(xmlData) {
    //
    this.api = new LPAPI();
    this.isShowAllLabel = true;
    this.updatePrinterSelect();
    // 用户在调用预览界面传递数据的时候不一定会按照我们的数据传递方式来传递，
    // 按照品胜的数据传递方式，有时候会传递一个数组，譬如陕西移动对接，
    // 所以为了兼容不同的数据格式，在解析数据的时候，对原始数据进行了判断解析操作；
    if (Object.prototype.toString.call(xmlData) === "[object Array]" && xmlData.length > 0)
        xmlData = xmlData[0];

    if (typeof xmlData === "string") {
        this.xmlData = xmlData;
    }
    else if (typeof xmlData === "object") {
        if (xmlData.xml && typeof xmlData.xml === "string")
            this.xmlData = xmlData.xml;
        else if (xmlData.xmlData && typeof xmlData.xmlData === "string")
            this.xmlData = xmlData.xmlData;
    }

    // 解析数据
    if (this.xmlData) {
        this.labelArray = this.parseLabelArray(this.xmlData);
    }
}

LabelPrint.prototype = {
    /**
     * 更新打印机列表；
     */
    updatePrinterSelect: function () {
        var $printerSelect = $("#label-select-printer-list");
        $printerSelect.empty();

        var printers = this.api.getSupportedPrinters();
        var printerArray = (printers ? printers.split(',') : null);

        if (!printerArray) {
            $printerSelect.append('<option>未检测到打印机</option>');
        } else {
            for (var i = 0; i < printerArray.length; i++) {
                $printerSelect.append('<option value="{0}">{0}</option>'.replace(/\{0}/ig, printerArray[i]));
            }
        }
    },
    /**
     * 解析xml字符串，并返回解析结果
     * @param xmlData 待解析的xml数据；
     * @return {Array} 解析出来的标签列表；
     */
    parseLabelArray: function (xmlData) {
        var labelArray = [];
        var This = this;
        this.parseXmlData(function (data) {
            var label = factory.getLabel(data.printType, data);
            labelArray.push(label);
        });

        return labelArray;
    },
    parseXmlData: function (callback) {
        if (!this.xmlData) return false;
        if (!callback || !(typeof callback === "function")) return false;

        // 获取打印机旋转方向，默认90度旋转（竖向打印）;
        var printElements = PrintUtils.getPrintElements(this.xmlData);
        if (!printElements || printElements.length <= 0)
            return false;

        for (var i = 0; i < printElements.length; i++) {
            var printElement = printElements[i];
            var printType = PrintUtils.getElementValueExt(printElement, Tags.PrintType);
            // textNodes转换为字符串数组；
            var textElements = printElement.getElementsByTagName(Tags.Text);
            var textList = [];
            var textArray = [];
            if (textElements && textElements.length > 0) {
                for (var j = 0; j < textElements.length; j++) {
                    textArray[j] = PrintUtils.getElementValue(textElements[j]);
                    textList[j] = {
                        name: textElements[j].getAttribute("name") || "",
                        value: textArray[j]
                    };
                }
            }

            callback({
                oldPrintType: printType,
                printType: factory.updatePrintType(printType),
                textArray: textArray,
                textList: textList,
                qrcode: PrintUtils.getElementValueExt(printElement, Tags.Code),
                title: PrintUtils.getElementValueExt(printElement, Tags.Title)
            });
        }

        return true;
    },
    /**
     * 打印给定的数据。
     * @return {boolean} 成功与否。
     */
    printLabel: function (xmlData) {
        if (xmlData) {
            this.xmlData = xmlData;
            this.labelArray = this.parseLabelArray(xmlData);
        }

        var printerName = $("#label-select-printer-list").val();
        if (!this.xmlData) return false;
        var theApi = this.api;

        // 1、打开打印机。
        if (!theApi.openPrinter(printerName))
            return false;

        // 2、打印标签；
        $.each(this.labelArray, function (index, value) {
            if (value) value.print(theApi);
        });

        // 3、关闭打印机；
        theApi.closePrinter();
        return true;
    },
    showAllLabel: function (flag) {
        this.isShowAllLabel = flag;
    },
    showExpandButton: function (flag) {
        if (flag)
            $(".label-more-expand").show();
        else
            $(".label-more-expand").hide();
    },
    showDropButton: function (flag) {
        if (flag)
            $(".label-more-drop").show();
        else
            $(".label-more-drop").hide();
    },
    /**
     * 获取标签预览信息，并将预览信息添加到给定的容器中。
     */
    updatePreview: function () {
        var $container = $("#label-preview-wrapper");
        if ($container.length <= 0)
            return;

        // 清除已有数据；
        $container.empty();
        // 生成预览界面;
        if (this.labelArray.length > 0) {
            // 显示第一张标签
            this.addLabelPreview($container, this.labelArray[0]);
            if (this.labelArray.length === 1) {
                this.showExpandButton(false);
                this.showDropButton(false);
            } else {
                if (this.isShowAllLabel) {
                    this.showExpandButton(false);
                    this.showDropButton(true);
                    for (var i = 1; i < this.labelArray.length; i++) {
                        this.addLabelPreview($container, this.labelArray[i]);
                    }
                } else {
                    this.showExpandButton(true);
                    this.showDropButton(false);
                }
            }
        } else {
            $container.append('<div style="font-size: 8mm;font-weight: bold;color: red;">数据解析失败，请检查报文格式是否正确!</div>');
        }
        // 将html中的所有二维码转换为真正的二维码；
        PrintUtils.updateQrcode($container[0]);
        // 将html中所有的一维码类转换为一维码；
        PrintUtils.updateBarcode($container[0]);
        // 将html中的图标样式转换为真正的图标
        // PrintUtils.updateImgSrc($container[0], ".label-logo-cmcc1", "./Images/LOGO-CMCC1.png", "中国移动");
        // 预览界面中的字体进行自动缩小操作；
        PrintUtils.autoShrink($container[0]);
    },
    addLabelPreview: function ($container, label) {
        if (typeof label === "string") {
            $container.append(label);
        } else if (typeof label === "object") {
            var result = label.preview($container[0]);
            if (typeof result === "string")
                $container.append(result);
        } else {
            $container.append('<div style="font-size: 8mm;font-weight: bold;color: red;">数据解析失败，请检查报文格式是否正确!</div>');
        }
    }
};

module.exports = LabelPrint;
