var PrintUtils = {
    /**
     * 将字符串中相关的变量转换成对应的值；
     * @param tmpl
     * @param data
     * @return {*}
     */
    buildTmp: function (tmpl, data) {
        tmpl = tmpl || "";
        data = data || {};

        return tmpl.replace(/{{\s*(\w*)\s*}}/g, function ($, $1) {
            return data.hasOwnProperty($1) ? data[$1] : "";
        });
    },
    /**
     * 将包含相关js代码的html模板转换成纯HTML字符串；
     * @param html 带转换字符串；
     * @param data 相关变量；
     * @return {string} 转换后的HTML字符串；
     */
    render: function (html, data) {
        var vars = this.dataToVars(data);
        var code = this.tplToCode(html);
        var render = Function('_data_', vars + code);

        return render(data);
    },
    dataToVars: function (data) {
        var varArr = [];
        for (var key in (data || {})) {
            varArr.push(key);
        }

        var vars = ''; // 把传来的data转成内部变量，提高性能
        while (varArr.length) {
            vars += this.buildTmp('var {{v}} = _data_["{{v}}"]\n', {v: varArr.shift()});
        }
        return vars;
    },
    tplToCode: function (tpl) {
        var eachI = 0; // each 嵌套 for 下标须不同
        var code = tpl
        // 转义 <>
            .replace(/&lt;/g, '<').replace(/&gt;/g, '>')
            // html
            .replace(/(^|%>|}})([\s\S]*?)({{|<%|$)/g, function ($, $1, $2, $3) {
                // html => js string 转义 ' \ \n
                return $1 + '\n_html_+= "' + $2.replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\r?\n/g, '\\n') + '"\n' + $3
            })
            // <%= %>
            .replace(/(<%=)([\s\S]*?)(%>)/g, '_html_+= ($2)\n') // <%= %>  [\s\S]允许换行
            // <% %>
            .replace(/(<%)(?!=)([\s\S]*?)(%>)/g, '\n\t$2\n') // <% js code %>  (?!=)不要匹配到<%= %>
            // each
            .replace(/{{each\s+([\$\w]*)\s*([\$\w]*)?\s*([\$\w]*)?}}/g, function ($, $1, $2, $3) {
                var $ii = '_ii_' + (eachI++);
                var each = 'for(var $ii=0; $ii<$1.length; $ii++){';
                each += $2 ? '\nvar $2 = $1[$ii];' : '\nvar $item = $1[$ii];';
                each += $3 ? '\nvar $3 = $ii;' : '';
                return each.replace(/\$1/g, $1).replace(/\$2/g, $2).replace(/\$3/g, $3).replace(/\$ii/g, $ii)
            })
            .replace(/{{\/each}}/g, '}')
            // if
            .replace(/{{if\s+(.*?)}}/g, 'if($1){')
            .replace(/{{else ?if (.*?)}}/g, '}else if($1){')
            .replace(/{{else}}/g, '}else{')
            .replace(/{{\/if}}/g, '}')
            // 表达式
            .replace(/{{=?([\s\S]*?)}}/g, '_html_+=$1');

        code = 'var _html_="";' + code + 'return _html_';
        return code;
    },
    /**
     * 解析xml数据，获取PrintElement标签列表。
     * @param xmlData
     * @return Array PrintElement标签列表。
     */
    getPrintElements: function (xmlData, tag) {
        tag = tag || "Print";
        if (!xmlData) return null;

        try {
            var xmlDoc;
            if (window.DOMParser) {
                xmlDoc = new DOMParser().parseFromString(xmlData, "text/xml");
            } else {    // 低版本IE浏览器
                xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
                xmlDoc.async = false;
                xmlDoc.loadXML(xmlData);
            }

            return xmlDoc.getElementsByTagName(tag);
        } catch (e) {
            return null;
        }
    },
    /**
     * 获取给定Element的值。
     * @param element
     * @return {string}
     */
    getElementValue: function (element) {
        try {
            return element.childNodes[0].nodeValue;
        } catch (e) {
            return "";
        }
    },
    /**
     * 从制定的元素中获取给定名称的标签内容；
     * @param element 要查找的根元素；
     * @param tagName 需要查找的目标Tag名称；
     * @returns {string} 查找结果；
     */
    getElementValueExt: function (element, tagName) {
        if (!element || !tagName)
            return "";
        try {
            var value = this.getElementValue(element.getElementsByTagName(tagName)[0]);
            if (!value)
                value = this.getElementValue(element.getElementsByTagName(tagName.toUpperCase())[0]);
            if (!value)
                value = this.getElementValue(element.getElementsByTagName(tagName.toLowerCase())[0]);
            return value || "";
        } catch (e) {
            return "";
        }
    },
    /**
     * 将需要显示二维码的标签中的标签数据转换为二维码显示出来；
     * @param container
     */
    updateQrcode: function (container) {
        if (!container) return;

        $(container).find(".label-qrcode").each(function () {
            var qrcodeData = this.getAttribute("data-qrcode");
            var lightColor = $(this).css("background-color");
            if (!qrcodeData)
                return;

            var width = $(this).innerWidth();
            var colorDark = $(this).css("foreground") || "#000000";
            var colorLight = PrintUtils.getBackgroundColor(this, "#ffffff");
            new QRCode(this, {
                width: width,
                height: width,
                colorDark: colorDark,
                colorLight: colorLight,
                correctLevel: QRCode.CorrectLevel.L
            }).makeCode(qrcodeData);
        });
    },
    /**
     * 将需要显示一维码的标签中的标签数据转换为一维码显示出来；
     * @param container
     */
    updateBarcode: function (container) {
        if (!container) return;

        $(container).find(".label-barcode").each(function () {
            var barcodeData = this.getAttribute("data-barcode");
            var lightColor = $(this).css("background-color");
            if (!barcodeData)
                return;

            var width = $(this).innerWidth();
            var colorDark = $(this).css("foreground") || "#000000";
            var colorLight = PrintUtils.getBackgroundColor(this, "#ffffff");
            var imgElement = this;
            if (this.tagName.match(/^DIV$/ig)) {
                imgElement = $('<img>').appendTo(this)[0];
            }
            try {
                JsBarcode(this, barcodeData, {
                    displayValue: false,
                    background: colorLight
                });
            } catch (e) {
                // 不支持JsBarcode时，直接显示图片；
                imgElement.src = 'Images/BARCODE.png';
            }
        });
    },
    updateImgSrc: function (container, selector, src, alt) {
        if (!container || !selector || !src) return;

        alt = alt || "";
        $(container).find(selector).each(function () {
            var img = '<img style="position: absolute;width: 100%; height: 100%;" alt="' + alt + '" src="' + src + '">';
            $(this).append(img);
        });
    },
    getBackgroundColor: function (element, defaultColor) {
        if (!element) return defaultColor;

        var color = $(element).css("background-color");
        if (!color || color === "transparent") {
            return PrintUtils.getBackgroundColor($(element).parent()[0]);
        }

        return color;
    },
    showOrientation: function () {
        $("#label-group-orientation").show();
        return this;
    },
    getOrientation: function () {
        return $("#label-select-orientation").val() * 90;
    },
    setOrientation: function (value) {
        $("#label-select-orientation").val(value);
        return this;
    },
    getIEVersion: function () {
        var userAgent = navigator.userAgent; //取得浏览器的userAgent字符串
        var isIE = userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1; //判断是否IE<11浏览器
        var isEdge = userAgent.indexOf("Edge") > -1 && !isIE; //判断是否IE的Edge浏览器
        var isIE11 = userAgent.indexOf('Trident') > -1 && userAgent.indexOf("rv:11.0") > -1;
        if (isIE) {
            var reIE = new RegExp("MSIE (\\d+\\.\\d+);");
            reIE.test(userAgent);
            var fIEVersion = parseFloat(RegExp["$1"]);
            switch (fIEVersion) {
                case 7 :
                    return 7;
                case 8:
                    return 8;
                case 9:
                    return 9;
                case 10:
                    return 10;
                default:
                    return 6;//IE版本<=7
            }
        } else if (isEdge) {
            return 'edge';//edge
        } else if (isIE11) {
            return 11; //IE11
        } else {
            return -1;//不是ie浏览器
        }
    },
    showCurrType: function () {
        $("#label-group-currType").show();
        return this;
    },
    setCurrType: function (name) {
        if (name) {
            var self = this;
            $("#label-select-currType").html(function (index, content) {
                var html = '<div style="font-weight: bold;font-size: 5mm;">{{name}}</div>';
                return self.buildTmp(html, {
                    name: name
                });
            });
        }
        return this;
    },
    /**
     * 添加标签型号；
     * @param items 标签型号列表；
     */
    addLabelStyles: function (items) {
        if (!items || items.length <= 0)
            return;
        var $labelStyle = $("#label-select-labelStyle");
        $labelStyle.empty();
        for (var i = 0; i < items.length; i++) {
            var option = $("<option>").val(items[i]).text(items[i]);
            $labelStyle.append(option);
        }
        return this;
    },
    /**
     * 获取当前选中的标签型号；
     */
    getLabelStyle: function () {
        return $("#label-select-labelStyle").val();
    },
    /**
     * 修改当前选中的标签型号；
     * @param value
     */
    setLabelStyle: function (value) {
        if (value) {
            $("#label-select-labelStyle").val(value);
        }
        return this;
    },
    showLabelStyle: function () {
        $("#label-group-labelStyle").show();
        return this;
    },
    formatDateTime: function (format, date) {
        if (!(typeof format === "string"))
            format = "yyyy-MM-dd hh:mm:ss";
        date = date || new Date();

        return format.replace(/yyyy/g, date.getFullYear())
            .replace(/MM/g, date.getMonth() + 1)
            .replace(/dd/g, date.getDate())
            .replace(/hh/g, date.getHours())
            .replace(/mm/g, date.getMinutes())
            .replace(/ss/g, date.getSeconds());
    },
    formatDate: function (format, date) {
        format = format || "yyyy-MM-dd";
        return this.formatDateTime(format, date);
    },
    formatTime: function (format, date) {
        format = format || "hh:mm:ss";
        return this.formatDateTime(format, date);
    },
    autoShrink: function (element) {
        // IE7没法比较，所以暂时不能自动缩小；
        if (this.getIEVersion() < 8)
            return;

        $(element).find('.label-auto-shrink').each(function () {
            var $me = $(this);
            var $parent = $me.parent();
            var fontSize = parseInt($me.css('font-size')) || 0;// 像素

            for (; $me.height() >= $parent.height() && fontSize > 0;) {
                $me.css('font-size', (--fontSize) + "px");
            }
        });
    },
    splitString: function (target, count) {
        target = target || "";
        count = count || 1024;
        var seperator = "\n";
        var list = [];
        var startIndex = 0;
        var lenth = 0;
        for (var i = 0; i < target.length; i++) {
            var charCode = target.charCodeAt(i);
            var charSize = charCode <= 128 ? 1 : 2;
            lenth += charSize;
            if (target.charAt(i) === seperator) {
                list.push(target.substring(startIndex, i));
                startIndex = i + 1;
                lenth = 0;
            } else if (lenth === count && target.charAt(i + 1) !== seperator) {
                // 如果下个字符是换行符，则会进行重复换行；
                list.push(target.substring(startIndex, i + 1));
                startIndex = i + 1;
                lenth = 0;
            } else if (lenth > count) {
                list.push(target.substring(startIndex, i));
                startIndex = i;
                lenth = charSize;
            }
        }
        if (lenth > 0)
            list.push(target.substr(startIndex));

        return list.join(seperator);
    }
};

module.exports = PrintUtils;
