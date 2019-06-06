module.exports = function () {
    var actionsList = [];
    var actionsForCalls = [];
    var actionsForSms = [];
    var totals = {
        call: 0.00,
        sms: 0.00,
        total: 0.00
    }
    var settings = {
        callCost: '',
        smsCost: '',
        warnLevel: '',
        critLevel: ''
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
        totals.total = (totals.call + totals.sms);
        return {call: totals.call.toFixed(2),sms:totals.sms.toFixed(2),total : totals.total.toFixed(2)};
    }
    function updateSettings(updatedSettings) {
        settings.callCost = Number(updatedSettings.callCost);
        settings.smsCost = Number(updatedSettings.smsCost);
        settings.warnLevel = Number(updatedSettings.warnLevel);
        settings.critLevel = Number(updatedSettings.critLevel);
    }
    function determineLevel() {
        grandTotal();
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
    function clearDataValues(){
        totals.total = 0;
        totals.call = 0;
        totals.sms = 0;

        settings.callCost = '';
        settings.smsCost = '';
        settings.warnLevel = '';
        settings.critLevel = '';
    }
    return {
        bill: addToBill,
        totals: grandTotal,
        level: determineLevel,
        update: updateSettings,
        settings: displaySettings,
        actions: displayActions,
        actionsFor: displayActionsFor,
        clear : clearDataValues
    }
}
