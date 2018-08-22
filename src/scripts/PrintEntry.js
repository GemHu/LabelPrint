module.exports = {
    printLabel: function (xmlData, url) {
        var openUrl = url || this.getUrl(); //预览页面
        var targetWindowStyle = "dialogHeight: 650px; dialogWidth: 620px; center: Yes; help: No; resizable: false; status: yes; scroll:yes";
        window.showModalDialog(openUrl, {xml: xmlData}, targetWindowStyle);
    },
    /**
     * 获取预览界面的绝对路径；
     */
    getUrl: function () {
        var scripts = document.scripts;
        var currFileName = "LN_LabelPrint.js";
        var targetFileName = "LN_LabelPrint.html";
        if (scripts) {
            for (var i = 0; i < scripts.length; i++) {
                var src = scripts[i].src || "";
                src = src.replace(/(^\s*)|(\s*$)/g, "");
                if (src.length >= currFileName.length && src.substr(src.length - currFileName.length).toUpperCase() === currFileName.toUpperCase())
                    return src.substring(0, src.length - currFileName.length) + targetFileName;
            }
        }

        return null;
    }
};