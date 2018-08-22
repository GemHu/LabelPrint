window.LnPrintEntry = require('./scripts/PrintEntry');
var config = require('./scripts/Config');
// 如果未检测到jQuery，则不执行相关初始化工作；
if (!window.$)
    return;

$(function () {
    var LabelPrint = require('./scripts/LabelPrint');
    var title = config.title + ' 打印预览';

    document.title = title;
    $("#label-preview-title").text(title);
    $(".footer").text(config.title + ' ' + config.version);
    //
    var data = window.dialogArguments;
    if (!data) {
        xml = '<?xml version="1.0" encoding="utf-8" ?>' +
            '<Data>' +
            '   <Print>' +

            '       <LabelType>TCM85_54</LabelType>' +
            '       <Code>260708010022155166557</Code>' +
            '       <Text>光缆名称：昆明枢纽楼-昆明广福路架空光缆</Text>' +
            '       <Text>光缆型号：GYTA2481.3</Text>' +
            '       <Text>光缆长度：12.3456</Text>' +
            '       <Text>光缆级别：省内二干</Text>' +
            '       <Text>资源编码：261234567890123456789</Text>' +

            '   </Print>' +
            '</Data>';

        data = {xml : xml};
    }
    var printer = new LabelPrint(data);

    //事件注册
    $("#label-btn-close").click(function () {
        window.close();
    });
    $("#label-btn-print").click(function () {
        window.returnValue = printer.printLabel();
    });
    $("#label-btn-show-data").click(function () {
        alert(printer.xmlData);
    });
    $(".label-update-preview").change(function () {
        printer.updatePreview("label-preview-wrapper");
    });

    // 更新预览界面；
//            $("#label-group-orientation").show();
    printer.updatePreview("label-preview-wrapper");
});