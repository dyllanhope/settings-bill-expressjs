"use strict";
const assert = require("assert");
const SettingsBill = require('../settingBill');

describe("settingsBill testing", function () {
    describe("updating tests", function () {
        it("should return {callCost: 2, smsCost: 3, warnLevel: 10, critLevel: 20} with call at 2, sms at 3, warn at 10 & crit at 20", function () {
            let billInstance = SettingsBill();
            billInstance.update({
                callCost: 2,
                smsCost: 3,
                warnLevel: 10,
                critLevel: 20
            });
            assert.deepEqual(billInstance.settings(), { 
                callCost: 2, 
                smsCost: 3, 
                warnLevel: 10, 
                critLevel: 20 
            });
        });
        it("should return {callCost: 1, smsCost: 2, warnLevel: 8, critLevel: 12} with call at 1, sms at 2, warn at 8 & crit at 12", function () {
            let billInstance = SettingsBill();
            billInstance.update({
                callCost: 1,
                smsCost: 2,
                warnLevel: 8,
                critLevel: 12
            });
            assert.deepEqual(billInstance.settings(), { 
                callCost: 1, 
                smsCost: 2, 
                warnLevel: 8, 
                critLevel: 12 
            });
        });
        it("should return {callCost: 0, smsCost: 0, warnLevel: 0, critLevel: 0} when not updated", function () {
            let billInstance = SettingsBill();
            assert.deepEqual(billInstance.settings(), { 
                callCost: 0, 
                smsCost: 0, 
                warnLevel: 0, 
                critLevel: 0 
            });
        });
        it("should return {callCost: 0, smsCost: 0, warnLevel: 0, critLevel: 0} when updated with empty strings", function () {
            let billInstance = SettingsBill();
            billInstance.update({
                callCost: '',
                smsCost: '',
                warnLevel: '',
                critLevel: ''
            });
            assert.deepEqual(billInstance.settings(), { 
                callCost: 0, 
                smsCost: 0, 
                warnLevel: 0, 
                critLevel: 0 
            });
        });
    });
    describe("totalling tests", function () {
        it("Should return totals of {call: 0, sms: 0, total: 0} with no updated values",function(){
            let billInstance = SettingsBill();
            billInstance.bill("call");
            billInstance.bill("call");
            billInstance.bill("sms");
            billInstance.bill("sms");
            billInstance.bill("sms");

            assert.deepEqual(billInstance.totals(),{
                call: 0,
                sms: 0,
                total: 0
            });
        });
        it("Should return totals of {call: 4, sms: 9, total: 13} with 2xCalls at R2 & 3xSms at R3",function(){
            let billInstance = SettingsBill();
            billInstance.update({
                callCost: 2,
                smsCost: 3,
                warnLevel: 10,
                critLevel: 20
            });
            billInstance.bill("call");
            billInstance.bill("call");
            billInstance.bill("sms");
            billInstance.bill("sms");
            billInstance.bill("sms");

            assert.deepEqual(billInstance.totals(),{
                call: 4,
                sms: 9,
                total: 13
            });
        });
        it("Should return totals of {call: 8, sms: 6, total: 14} with 4xCalls at R2 & 2xSms at R3",function(){
            let billInstance = SettingsBill();
            billInstance.update({
                callCost: 2,
                smsCost: 3,
                warnLevel: 10,
                critLevel: 20
            });
            billInstance.bill("call");
            billInstance.bill("call");
            billInstance.bill("sms");
            billInstance.bill("sms");
            billInstance.bill("call");
            billInstance.bill("call");

            assert.deepEqual(billInstance.totals(),{
                call: 8,
                sms: 6,
                total: 14
            });
        });
        it("Should return totals of {call: 8, sms: 9, total: 17} with 5xCalls at R2 & 4xSms at R3 (doesn't go over crit level)",function(){
            let billInstance = SettingsBill();
            billInstance.update({
                callCost: 2,
                smsCost: 3,
                warnLevel: 10,
                critLevel: 15
            });
            billInstance.bill("call");
            billInstance.bill("call");
            billInstance.bill("sms");
            billInstance.bill("sms");
            billInstance.bill("call");
            billInstance.bill("call");
            billInstance.bill("sms");
            // crit level reached
            billInstance.bill("call");
            billInstance.bill("sms");


            assert.deepEqual(billInstance.totals(),{
                call: 8,
                sms: 9,
                total: 17
            });
        });
        it("Should return totals of {call: 4, sms: 6, total: 10} when 3xCalls, 2xSms at no value updated to 2xCalls at R2 & 2xSms at R3",function(){
            let billInstance = SettingsBill();

            billInstance.bill("call");
            billInstance.bill("call");
            billInstance.bill("sms");
            billInstance.bill("sms");
            billInstance.bill("call");
            billInstance.update({
                callCost: 2,
                smsCost: 3,
                warnLevel: 10,
                critLevel: 15
            });
            billInstance.bill("call");
            billInstance.bill("sms");
            // crit level reached
            billInstance.bill("call");
            billInstance.bill("sms");


            assert.deepEqual(billInstance.totals(),{
                call: 4,
                sms: 6,
                total: 10
            });
        });
    });
    describe("warning & critical level tests",function(){
        it("Should return the string 'warning' as the total exceeded the warning level",function(){
            let billInstance = SettingsBill();
            billInstance.update({
                callCost: 1,
                smsCost: 2,
                warnLevel: 8,
                critLevel: 12
            });
            billInstance.bill("call");
            billInstance.bill("call");
            billInstance.bill("sms");
            billInstance.bill("sms");
            billInstance.bill("call");
            billInstance.bill("call");
            billInstance.bill("sms");
            billInstance.bill("call");

            assert.equal(billInstance.level(),"warning");
        });
        it("Should return the string 'danger' as the total exceeded the critical level",function(){
            let billInstance = SettingsBill();
            billInstance.update({
                callCost: 1,
                smsCost: 2,
                warnLevel: 8,
                critLevel: 12
            });
            billInstance.bill("call");
            billInstance.bill("call");
            billInstance.bill("sms");
            billInstance.bill("sms");
            billInstance.bill("call");
            billInstance.bill("call");
            billInstance.bill("sms");
            billInstance.bill("call");
            billInstance.bill("call");
            billInstance.bill("sms");
            billInstance.bill("call");

            assert.equal(billInstance.level(),"danger");
        });
        it("Should return the string 'safe' as the total hasn't exceeded the any set level",function(){
            let billInstance = SettingsBill();
            billInstance.update({
                callCost: 1,
                smsCost: 2,
                warnLevel: 8,
                critLevel: 12
            });
            billInstance.bill("call");
            billInstance.bill("call");
            billInstance.bill("sms");

            assert.equal(billInstance.level(),"safe");
        });
    });
    describe("Action data tests",function(){
        it("Should return a list of 1xSms at cost 3 and 2xCall at cost 2 all with correct times",function(){
            let billInstance = SettingsBill();
            billInstance.update({
                callCost: 2,
                smsCost: 3,
                warnLevel: 10,
                critLevel: 15
            });
            billInstance.bill("sms");
            billInstance.bill("call");
            billInstance.bill("call");

            assert.deepEqual(billInstance.actions(),[
                {type: "sms",cost: 3,timeStamp: new Date()},
                {type: "call",cost: 2,timeStamp: new Date()},
                {type: "call",cost: 2,timeStamp: new Date()}
            ]);
        });
        it("Should return a list of 5xSms at cost 2 and 4xCall at cost 1 all with correct times",function(){
            let billInstance = SettingsBill();
            billInstance.update({
                callCost: 1,
                smsCost: 2,
                warnLevel: 30,
                critLevel: 35
            });
            billInstance.bill("sms");
            billInstance.bill("call");
            billInstance.bill("call");
            billInstance.bill("sms");
            billInstance.bill("sms");
            billInstance.bill("call");
            billInstance.bill("sms");
            billInstance.bill("call");
            billInstance.bill("sms");

            assert.deepEqual(billInstance.actions(),[
                {type: "sms",cost: 2,timeStamp: new Date()},
                {type: "call",cost: 1,timeStamp: new Date()},
                {type: "call",cost: 1,timeStamp: new Date()},
                {type: "sms",cost: 2,timeStamp: new Date()},
                {type: "sms",cost: 2,timeStamp: new Date()},
                {type: "call",cost: 1,timeStamp: new Date()},
                {type: "sms",cost: 2,timeStamp: new Date()},
                {type: "call",cost: 1,timeStamp: new Date()},
                {type: "sms",cost: 2,timeStamp: new Date()}
            ]);
        });
        it("Should return an empty list when no items are added",function(){
            let billInstance = SettingsBill();
            billInstance.update({
                callCost: 1,
                smsCost: 2,
                warnLevel: 30,
                critLevel: 35
            });

            assert.deepEqual(billInstance.actions(),[]);
        });
    });
    describe("Actions for data tests",function(){
        it("Should return a list of 4xCalls at R1 with correct times",function(){
            let billInstance = SettingsBill();
            billInstance.update({
                callCost: 1,
                smsCost: 2,
                warnLevel: 30,
                critLevel: 35
            });
            billInstance.bill("sms");
            billInstance.bill("call");
            billInstance.bill("call");
            billInstance.bill("sms");
            billInstance.bill("sms");
            billInstance.bill("call");
            billInstance.bill("sms");
            billInstance.bill("call");
            billInstance.bill("sms");

            assert.deepEqual(billInstance.actionsFor("call"),[
                {type: "call",cost: 1,timeStamp: new Date()},
                {type: "call",cost: 1,timeStamp: new Date()},
                {type: "call",cost: 1,timeStamp: new Date()},
                {type: "call",cost: 1,timeStamp: new Date()},
            ]);
        })
        it("Should return a list or 5xSms at R2 with correct times",function(){
            let billInstance = SettingsBill();
            billInstance.update({
                callCost: 1,
                smsCost: 2,
                warnLevel: 30,
                critLevel: 35
            });
            billInstance.bill("sms");
            billInstance.bill("call");
            billInstance.bill("call");
            billInstance.bill("sms");
            billInstance.bill("sms");
            billInstance.bill("call");
            billInstance.bill("sms");
            billInstance.bill("call");
            billInstance.bill("sms");

            assert.deepEqual(billInstance.actionsFor("sms"),[
                {type: "sms",cost: 2,timeStamp: new Date()},
                {type: "sms",cost: 2,timeStamp: new Date()},
                {type: "sms",cost: 2,timeStamp: new Date()},
                {type: "sms",cost: 2,timeStamp: new Date()},
                {type: "sms",cost: 2,timeStamp: new Date()}
            ]);
        });
        it("Should return 2 empty lists of the actions for both call and sms with no items billed",function(){
            let billInstance = SettingsBill();
            billInstance.update({
                callCost: 1,
                smsCost: 2,
                warnLevel: 30,
                critLevel: 35
            });

            assert.deepEqual(billInstance.actionsFor("sms"),[]);
            assert.deepEqual(billInstance.actionsFor("call"),[]);

        });
    });
});