const express = require('express')
var cors = require('cors')
var bodyParser = require('body-parser')
const app = express()

var logErrors = function (err, req, res, next) {
    console.error(err.stack)
    next(err)
};

var clientErrorHandler = function (err, req, res, next) {
    if (req.xhr) {
        res.status(500).send({ error: 'Something failed!' })
    } else {
        next(err)
    }
};

var errorHandler = function (err, req, res, next) {
    res.status(500)
    res.render('error', { error: err })
};


app.use(cors());
app.use(bodyParser.json());

app.use(logErrors);
app.use(clientErrorHandler);
app.use(errorHandler);

var Datastore = require('nedb');
var db = new Datastore({ filename: 'mf.db', autoload: true });


app.get('/mutualFundHouses', function (req, res) {
    res.send(['Axis Mutual Fund', 'HSBC Mutual Fund']);
});


app.get('/mutualFunds', function (req, res, next) {
    db.find({ mutual_fund_house: req.query.selectedFundHouse }, { mutual_fund_name: 1, _id: 0 }, function (err, docs) {
        if (err) {
            next(err); // Pass errors to Express.
        }
        else {
            let mutual_fund_set = new Set();
            for (doc of docs) {
                mutual_fund_set.add(doc.mutual_fund_name);
            };
            let mutualFunds = Array.from(mutual_fund_set);
            res.send(mutualFunds);
        }
    });
});

app.post('/computeReturn', function (req, res, next) {
    db.find({ mutual_fund_name: req.body.selectedFund, date: { $lte: new Date(req.body.date) } }, { net_asset_value: 1, _id: 0 }).sort({ date: -1 }).limit(1).exec(
        function (err, doc) {
            if (err) {
                next(err); // Pass errors to Express.
            }
            else {
                let sharesPurchased = req.body.amount / doc[0].net_asset_value;
                db.find({ mutual_fund_name: req.body.selectedFund, date: { $gte: new Date(req.body.date) } }, { net_asset_value: 1, _id: 0 }).sort({ date: -1 }).limit(1).exec(
                    function (err, docx) {
                        if (err) {
                            next(err); // Pass errors to Express.
                        }
                        else {
                            let returnAmount = Math.round(docx[0].net_asset_value * sharesPurchased);
                            res.send({ returnAmount: returnAmount });
                        }
                    });

            }
        });
});

app.listen(3000, () => console.log('Listening on port 3000!'))