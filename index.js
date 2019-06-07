const express = require('express');
const moment = require('moment');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');

const SettingsBill = require('./settingBill');

const app = express();
const settingsBill = SettingsBill();


const helpers = {

    isWarn: function () {
        let testData = settingsBill.totals();
        console.log(testData)
        if (testData.total !== "0.00") {
            if (settingsBill.level() === "warning") {
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    },
    isCrit: function () {
        let testData = settingsBill.totals();
        if (testData.total !== "0.00") {
            if (settingsBill.level() === "danger") {
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    }
};

const handlebarSetup = exphbs({
    partialsDir: "./views/partials",
    viewPath: './views',
    layoutsDir: './views/layouts',
    helpers
});

app.engine('handlebars', handlebarSetup);
app.set('view engine', 'handlebars');

app.use(express.static('public'));

app.use(bodyParser.urlencoded({ extended: false }))

app.use(bodyParser.json())

app.get('/', function (req, res) {
    res.render("index", {
        settings: settingsBill.settings(),
        totals: settingsBill.totals()
    });
});

app.post('/settings', function (req, res) {

    settingsBill.update({
        callCost: req.body.callCost,
        smsCost: req.body.smsCost,
        warnLevel: req.body.warnLevel,
        critLevel: req.body.critLevel
    });

    res.redirect('/');
});

app.post('/action', function (req, res) {
    if(req.body.actionType){
        settingsBill.bill(req.body.actionType);
        res.redirect('/');
    }else{
        res.send("Please choose either call or sms");
    }
});

app.post('/reset', function (req, res) {

    settingsBill.clear();

    res.redirect('/');
});

app.get('/action', function (req, res) {
    let actionData = settingsBill.actions();
    for (let x = 0; x < actionData.length; x++) {
        actionData[x].prettyTime = moment(actionData[x].timeStamp).fromNow();
    }
    res.render('action', { actions: actionData });
});

app.get('/action/:actionsType', function (req, res) {
    const actionsType = req.params.actionsType;
    let actionData = settingsBill.actionsFor(actionsType)
    for (let x = 0; x < actionData.length; x++) {
        actionData[x].prettyTime = moment(actionData[x].timeStamp).fromNow();
    }
    res.render('action', { actions: actionData });
});

const PORT = process.env.PORT || 3009;

app.listen(PORT, function () {
    console.log("app started at port: " + PORT);
});