const assert = require("assert"); 
const SettingsBill = require('../settingBill');

describe("settingsBill testing", function () {
    it("should return {callCost: 2, smsCost: 3, warnLevel: 10, critLevel: 20}", function () {
        let billInstance = SettingsBill();
        billInstance.update({
            callCost: 2,
            smsCost: 3,
            warnLevel: 10,
            critLevel: 20
        });
        assert.deepEqual(billInstance.settings(),{callCost: 2, smsCost: 3, warnLevel: 10, critLevel: 20});
    })
});