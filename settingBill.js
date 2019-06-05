module.exports = function () {
    var actionsList = [];
    var actionsForCalls = [];
    var actionsForSms = [];
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
        totals.total = totals.call + totals.sms;
        if (totals.total < settings.critLevel) {
            if (billString.trim() === "call") {
                totals.call += settings.callCost;
                var cost = settings.callCost;
                actionsForCalls.push({
                    type: billString,
                    cost,
                    timeStamp: new Date()
                });
            }
            else if (billString.trim() === "sms") {
                totals.sms += settings.smsCost;
                var cost = settings.smsCost;
                actionsForSms.push({
                    type: billString,
                    cost,
                    timeStamp: new Date()
                });
            }
            actionsList.push({
                type: billString,
                cost,
                timeStamp: new Date()
            })
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
        if ((totals.total >= settings.warnLevel) && (totals.total < settings.critLevel)) {
            return "warning";
        } else if (totals.total >= settings.critLevel) {
            return "danger";
        } else {
            return "safe";
        }
    }
    function displaySettings() {
        return settings;
    }
    function displayActions() {
        return actionsList;
    }
    function displayActionsFor(actionType) {
        if (actionType === "call") {
            return actionsForCalls;

        } else if (actionType === "sms") {
            return actionsForSms;
        }

    }
    return {
        bill: addToBill,
        totals: grandTotal,
        level: determineLevel,
        update: updateSettings,
        settings: displaySettings,
        actions: displayActions,
        actionsFor: displayActionsFor
    }
}
