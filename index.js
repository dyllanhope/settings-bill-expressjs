const express = require('express');
// const exphbs  = require('express-handlebars');
const bodyParser = require('body-parser');
const settingBill = require ('./public/js/settingBill')
let app = express();

var settingInstance = settingBill();

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.get('/', function (req, res) {
    res.render('home');
});
app.post('/settings', function(req, res){
    let smsCost = req.body.smsCost;
    let callCost = req.body.callCost;
    let warningLevel = req.body.warningLevel;
    let criticalLevel = req.body.criticalLevel;

    var settings = {
      smsCost,
      callCost,
      warningLevel,
      criticalLevel
    };

    globalSetings = settings;

    res.render('home', {settings})
});

let PORT = process.env.PORT || 3009;

app.listen(PORT, function () {
    console.log('App starting on port', PORT);
});