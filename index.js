const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');

const SettingsBill = require('./settingBill');

const app = express();
const settingsBill = SettingsBill();

const helpers = {

    isWarn: function () {
        let testData = settingsBill.totals();
        if (testData.total !== 0) {
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
        if (testData.total !== 0) {
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

    settingsBill.bill(req.body.actionType);

    res.redirect('/');
});

app.get('/actions', function (req, res) {
    res.render('actions', { actions: settingsBill.actions() });
});

app.get('/actions/:actionsType', function (req, res) {
    const actionsType = req.params.actionsType;
    res.render('actions', { actions: settingsBill.actionsFor(actionsType) });
});

const PORT = process.env.PORT || 3009;

app.listen(PORT, function () {
    console.log("app started at port: " + PORT);
});