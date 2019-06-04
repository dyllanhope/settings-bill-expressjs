const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');

const SettingsBill = require('./settingBill');

const app = express();
const settingsBill = SettingsBill();

const handlebarSetup = exphbs({
    partialsDir: "./views/partials",
    viewPath:  './views',
    layoutsDir : './views/layouts'
});

app.engine('handlebars', handlebarSetup);
app.set('view engine', 'handlebars');

app.use(express.static('public'));

app.use(bodyParser.urlencoded({ extended: false }))

app.use(bodyParser.json())

app.get('/', function (req, res) {
    res.render("index",{
        settings : settingsBill.settings(),
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

    console.log(settingsBill.settings());

    res.redirect('/');
});

app.post('/action', function (req, res) {

    settingsBill.bill(req.body.actionType);
    console.log(settingsBill.totals())

    res.redirect('/');
});

app.get('/actions', function (req, res) {

});

app.get('/actions/:type', function (req, res) {

});

const PORT = process.env.PORT || 3009;

app.listen(PORT, function () {
    console.log("app started at port: " + PORT);
});