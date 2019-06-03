const express = require('express');
const exphbs  = require('express-handlebars');
let app = express();
app.use(express.static('public'));

// app.engine('handlebars', exphbs({defaultLayout: 'main'}));
// app.set('view engine', 'handlebars');

// app.get('/title', function (req, res) {
//     res.render('home');
// });

// app.get("/", function (req, res) {
//     res.send("Dyllan's Bill Settings WebApp");
// });

let PORT = process.env.PORT || 3009;

app.listen(PORT, function () {
    console.log('App starting on port', PORT);
});