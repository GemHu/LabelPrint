// region LabelPrintAPI 标签打印机类，对OCX插件对象的封装
function LPAPI() {
    this.init();
}

LPAPI.prototype = {
    init: function () {
        if (!this.dtPrinter)
            this.dtPrinter = document.getElementById("dtPrinter");
        if (this.dtPrinter)
            return;

        // 添加ocx标签
        try {
            var div = document.createElement("div");
            div.style.display = "none";
            div.innerHTML = '<object id="dtPrinter" classid="clsid:9D846E42-C3EF-4A5D-9805-A269CE7AA470"></object>';
            if (document.body)
                document.body.appendChild(div);
            else
                document.appendChild(div);

            this.dtPrinter = document.getElementById("dtPrinter");

            try {
                this.dtPrinter.GetPrinterName();
            } catch (e) {
                this.showAlert();
            }
        } catch (e) {
        }
    }, showAlert: function () {
        var aMsg = ['未检测到打印机插件，如需正常使用，请参考如下信息：'];
        aMsg.push('1、请确保当前浏览器为IE浏览器；');
        aMsg.push('2、如果当前浏览器支持IE内核，如：360、猎豹等浏览器，请切换到兼容模式；');
        aMsg.push('3、如果浏览器没问题，请确保电脑已正确安装打印机插件，或者包含打印插件的驱动程序；');
        aMsg.push('4、如果未安装打印插件，请点击用上角的插件下载链接，或者联系打印机供应商，获取安装程序；');
        aMsg.push('5、关闭所有游览器，双击并运行插件安装程序；');
        aMsg.push('6、如果在打开网页的时候未弹出“internet explorer已限制此网页运行脚本或者ActiveX控件”等相关提示，则可能是是打印控件被浏览器拦截了，可以做如下配置：工具-Internet选项-安全-Internet-将安全级别调到最低（如果不能调，则需要先点击默认级别，然后在左侧出现滑动条）；');
        alert(aMsg.join('\n'));
    }, getItemOrientation: function () {
        return this.dtPrinter.ItemOrientation;
    }, setItemOrientation: function (nNewValue) {
        this.dtPrinter.ItemOrientation = nNewValue;
    }, getItemHorizontalAlignment: function () {
        return this.dtPrinter.ItemHorizontalAlignment;
    }, setItemHorizontalAlignment: function (nNewValue) {
        this.dtPrinter.ItemHorizontalAlignment = nNewValue;
    }, getItemVerticalAlignment: function () {
        return this.dtPrinter.ItemVerticalAlignment;
    }, setItemVerticalAlignment: function (nNewValue) {
        this.dtPrinter.ItemVerticalAlignment = nNewValue;
    }, openPrinter: function (printerName) {
        return this.dtPrinter.OpenPrinter(printerName) === 0;
    }, getPrinterName: function () {
        return this.dtPrinter.GetPrinterName();
    }, isPrinterOpened: function () {
        return this.dtPrinter.IsPrinterOpened() === 0;
    }, isPrinterOnline: function () {
        return this.dtPrinter.IsPrinterOnline() === 0;
    }, closePrinter: function () {
        this.dtPrinter.ClosePrinter();
    }, getSupportedPrinters: function (onlyOnline) {
        onlyOnline = (onlyOnline === undefined ? false : onlyOnline);
        this.init();

        try {
            return this.dtPrinter.GetSupportedPrinters(onlyOnline);
        } catch (e) {
        }

        return false;
    }, getAllPrinters: function (onlyOnline) {
        onlyOnline = (onlyOnline === undefined ? false : onlyOnline);
        this.init();

        try {
            return this.dtPrinter.GetAllPrinters(onlyOnline);
        } catch (e) {
        }

        return false;
    },
    isPostek: function () {
        var printerName = this.getPrinterName() || "";
        return /^\s*POSTEK/i.test(printerName);
    },
    isHiTi: function () {
        var printerName = this.getPrinterName() || "";
        return /^\s*HiTi.*/i.test(printerName);
    },
    isIT2600: function () {
        var printerName = this.getPrinterName() || "";
        if (/\.*iT-2600/i.test(printerName))
            return true;
        if (/\.*Magicard Enduro/i.test(printerName))
            return true;
        return /\.*ING171/i.test(printerName);
    },
    startJob: function (width, height, orientation, jobName) {
        orientation = (orientation === undefined ? 0 : orientation);
        jobName = (jobName === undefined ? "" : jobName);
        // 博思得打印机与我们的打印西坐标系相差180度；
        if (this.isPostek()) {
            orientation += 180;
            if (orientation % 360 === 0)
                width += 2.5;
            else if (orientation % 360 === 270)
                height += 2.5;
        } else if (this.isIT2600()) {
            orientation += 90;
        } else if (this.isHiTi()) {
            orientation -= 90;
        }
        // 博思得打印机旋转角度为负数的时候都被当做0度处理，所以在此需要就角度进行下修正；
        orientation = (orientation % 360 + 360) % 360;
        if (this.dtPrinter.StartJob(width * 100, height * 100, 30, orientation, 1, jobName) === 0) {
            // 重置相关编辑参数，避免上一张标签的参数影响当前标签；
            this.setItemHorizontalAlignment(0);
            this.setItemVerticalAlignment(0);
            this.setItemOrientation(0);
            return true;
        }

        return false;
    }, abortJob: function () {
        this.dtPrinter.AbortJob();
    }, commitJob: function () {
        return this.dtPrinter.CommitJob() === 0;
    }, startPage: function () {
        return this.dtPrinter.StartPage() === 0;
    }, endPage: function () {
        this.dtPrinter.EndPage();
    }, isWin8: function () {
        return navigator.userAgent.match(/windows\s*nt\s*(6\.[2-3].*)/i);
    }, isWin10: function () {
        return navigator.userAgent.match(/windows\s*nt\s*(10\.[0-9]*)/i);
    }, drawText: function (text, x, y, width, height, fontName, fontHeight, fontStyle) {
        if (!fontName) fontName = "黑体";
        if (!fontHeight) fontHeight = height;
        // win10系统不支持粗体及斜体，否则字体显示乱码
        fontStyle = (this.isWin10() || this.isWin8()) ? 0 : (fontStyle || 0);
        return this.dtPrinter.DrawText(text, x * 100, y * 100, width * 100, height * 100, fontName, fontHeight * 100, fontStyle) === 0;
    }, draw1DBarcode: function (text, type, x, y, width, height, textHeight) {
        if (type <= 20 || type > 60) type = 60;
        textHeight = (this.isWin10() || this.isWin8()) ? 0 : (typeof textHeight === "number" ? textHeight : 3);
        return this.dtPrinter.Draw1DBarcode(text, type, x * 100, y * 100, width * 100, height * 100, textHeight * 100) === 0;
    }, draw2DQRCode: function (text, x, y, width, height) {
        width = width || 0;
        height = height || width;
        return this.dtPrinter.Draw2DQRCode(text, x * 100, y * 100, width * 100, height * 100) === 0;
    }, draw2DPdf417: function (text, x, y, width, height) {
        return this.dtPrinter.Draw2DPdf417(text, x * 100, y * 100, width * 100, height * 100) === 0;
    }, drawRectangle: function (x, y, width, height, lineWidth) {
        if (lineWidth === undefined) lineWidth = 0.3;
        return this.dtPrinter.DrawRectangle(x * 100, y * 100, width * 100, height * 100, lineWidth * 100) === 0;
    }, fillRectangle: function (x, y, width, height) {
        return this.dtPrinter.FillRectangle(x * 100, y * 100, width * 100, height * 100) === 0;
    }, drawRoundRectangle: function (x, y, width, height, cornerWidth, cornerHeight, lineWidth) {
        if (cornerWidth === undefined) cornerWidth = 1.5;
        cornerHeight = cornerHeight || cornerWidth;
        if (lineWidth === undefined) lineWidth = 0.3;
        return this.dtPrinter.DrawRoundRectangle(x * 100, y * 100, width * 100, height * 100, cornerWidth * 100, cornerHeight * 100, lineWidth * 100) === 0;
    }, fillRoundRectangle: function (x, y, width, height, cornerWidth, cornerHeight) {
        if (cornerWidth === undefined) cornerWidth = 1.5;
        cornerHeight = cornerHeight || cornerWidth;
        return this.dtPrinter.FillRoundRectangle(x * 100, y * 100, width * 100, height * 100, cornerWidth * 100, cornerHeight * 100) === 0;
    }, drawEllipse: function (x, y, width, height, lineWidth) {
        if (lineWidth === undefined) lineWidth = 0.5;
        return this.dtPrinter.DrawEllipse(x * 100, y * 100, width * 100, height * 100, lineWidth * 100) === 0;
    }, fillEllipse: function (x, y, width, height) {
        return this.dtPrinter.FillEllipse(x * 100, y * 100, width * 100, height * 100) === 0;
    }, drawLine: function (x1, y1, x2, y2, lineWidth) {
        if (lineWidth === undefined) lineWidth = 0.3;
        return this.dtPrinter.DrawLine(x1 * 100, y1 * 100, x2 * 100, y2 * 100, lineWidth * 100) === 0;
    }, drawDashLine2: function (x1, y1, x2, y2, lineWidth, dashLen1, dashLen2) {
        lineWidth = (lineWidth ? lineWidth : 0.3);
        dashLen1 = (dashLen1 ? dashLen1 : 0.5);
        dashLen2 = (dashLen2 ? dashLen2 : dashLen1 * 0.5);
        return this.dtPrinter.DrawDashLine2(x1 * 100, y1 * 100, x2 * 100, y2 * 100, lineWidth * 100, dashLen1 * 100, dashLen2 * 100) === 0;
    }, drawDashLine4: function (x1, y1, x2, y2, lineWidth, dashLen1, dashLen2, dashLen3, dashLen4) {
        lineWidth = (lineWidth ? lineWidth : 0.5);
        dashLen1 = (dashLen1 ? dashLen1 : 0.5);
        dashLen2 = (dashLen2 ? dashLen2 : dashLen1);
        dashLen3 = (dashLen3 ? dashLen3 : dashLen1 * 0.5);
        dashLen4 = (dashLen4 ? dashLen4 : dashLen1 * 0.5);
        return this.dtPrinter.DrawDashLine4(x1 * 100, y1 * 100, x2 * 100, y2 * 100, lineWidth * 100, dashLen1 * 100, dashLen2 * 100, dashLen3 * 100, dashLen4 * 100) === 0;
    }, drawImage: function (imageFile, x, y, width, height, threshold) {
        if (threshold === undefined) threshold = 192;
        return this.dtPrinter.DrawImage(imageFile, x * 100, y * 100, width * 100, height * 100, threshold) === 0;
    }
};

module.exports = LPAPI;
