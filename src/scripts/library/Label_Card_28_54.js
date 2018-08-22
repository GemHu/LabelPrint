var config = require('../Config');
var printUtils = require('../PrintUtils');

module.exports = {
    preview : function (data, param) {
        param = param || {};
        var textArray = data.textArray || [];

        var html = '' +
            '<div class="label label-card-28-54-V">' +
            '   <div class="label-card-28-54-V-hole"/>' +
            '   <div style="position: absolute; width: 100%; top: 40%;height: 40%;font-size: 18mm;">{{text1}}</div>' +
            '   <div style="position: absolute; width: 100%; top: 80%;height: 20%;font-size: 8mm;">{{text2}}</div>' +
            '</div>';

        return printUtils.buildTmp(html, {
            text1 : textArray.slice(0, 2).join(''),
            text2 : (textArray[2] || "")
        });
    },
    print : function (api, data, param) {
        param = param || {};
        var textArray = data.textArray || [];
        var width = 54;
        var height = 28;
        var orientation = 90;
        // var fontHeight = 6;

        if (!api.startJob(width, height, orientation))
            return false;

        var holeWidth = 4;
        api.setItemOrientation(270);
        api.setItemHorizontalAlignment(1);
        api.setItemVerticalAlignment(0);
        if (config.DEBUG) {
            api.drawRoundRectangle(0, 0, width, height);
            api.drawRoundRectangle(4, (height - holeWidth) / 2, holeWidth, holeWidth, holeWidth / 2, holeWidth / 2);
        }
        if (textArray.length > 0)
            api.drawText(textArray.slice(0, 2).join(''), 20, 0, 20, height, null, 15, 1);
        if (textArray[2])
            api.drawText(textArray[2], 40, 0, 14, height, null, 6, 1);

        return api.commitJob();
    }
};
