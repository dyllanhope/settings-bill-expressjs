module.exports = function () {
    var totals = {
        call: 0,
        sms: 0,
        total: 0
    }
    var settings = {
        callCost: 0,
        smsCost: 0,
        warnLevel: 0,
        critLevel: 0
    }

    function addToBill(billString) {
            if (billString.trim() === "call") {
                totals.call += settings.callCost;
            }
            else if (billString.trim() === "sms") {
                totals.sms += settings.smsCost;
            }
    }

    function grandTotal() {
        totals.total = totals.call + totals.sms;
        return totals;
    }
    function updateSettings(updatedSettings) {
        settings.callCost = Number(updatedSettings.callCost);
        settings.smsCost = Number(updatedSettings.smsCost);
        settings.warnLevel = Number(updatedSettings.warnLevel);
        settings.critLevel = Number(updatedSettings.critLevel);
    }
    function determineLevel() {
        if ((grandTotal() >= settings.warnLevel) && (grandTotal() < settings.critLevel)) {
            return "warning";
        } else if (grandTotal() >= settings.critLevel) {
            return "danger";
        } else {
            return "safe";
        }
    }
    function displaySettings() {
        return settings;
    }
    return {
        bill: addToBill,
        totals: grandTotal,
        level: determineLevel,
        update: updateSettings,
        settings: displaySettings
    }
}
