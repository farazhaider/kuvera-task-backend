const express = require('express')
var cors = require('cors')
var bodyParser = require('body-parser')

const app = express()

app.use(cors());
app.use(bodyParser.json())

var Datastore = require('nedb')
    , db = new Datastore({ filename: 'mf.db', autoload: true });


// db.find({ mutual_fund_name: "Axis Midcap Fund - Direct Plan - Growth", date: { $lte: new Date("05-Feb-2018") } }, { net_asset_value: 1, _id: 0 }).sort({ date: -1 }).limit(1).exec(
//     function (err, doc) {
//         let sharesPurchased = 10000.0 / doc[0].net_asset_value;
//         db.find({ mutual_fund_name: "Axis Midcap Fund - Direct Plan - Growth", date: { $gte: new Date("05-Feb-2018") } }, { net_asset_value: 1, _id: 0 }).sort({ date: -1 }).limit(1).exec(
//             function (err, docx) {
//                 let returnAmount = docx[0].net_asset_value * sharesPurchased;
//                 console.log(returnAmount);
//             });
//     });

app.get('/mutualFundHouses', function (req, res) {
    res.status(200).send(['Axis Mutual Fund', 'HSBC Mutual Fund']);
});


app.get('/mutualFunds', function (req, res) {
    db.find({ mutual_fund_house: req.query.selectedFundHouse }, { mutual_fund_name: 1, _id: 0 }, function (err, docs) {
        let mutual_fund_set = new Set();
        for (doc of docs) {
            mutual_fund_set.add(doc.mutual_fund_name);
        };
        let mutualFunds = Array.from(mutual_fund_set);
        res.send(mutualFunds);
    });
});

app.post('/computeReturn', function (req, res) {
    db.find({ mutual_fund_name: req.body.selectedFund, date: { $lte: new Date(req.body.date) } }, { net_asset_value: 1, _id: 0 }).sort({ date: -1 }).limit(1).exec(
        function (err, doc) {
            console.log(err);
            console.log(doc);
            let sharesPurchased = req.body.amount / doc[0].net_asset_value;
            db.find({ mutual_fund_name: req.body.selectedFund, date: { $gte: new Date(req.body.date) } }, { net_asset_value: 1, _id: 0 }).sort({ date: -1 }).limit(1).exec(
                function (err, docx) {
                    console.log(err);
                    console.log(doc);
                    let returnAmount = Math.round( docx[0].net_asset_value * sharesPurchased );
                    res.send({returnAmount : returnAmount});
                });
        });
});


app.listen(3000, () => console.log('Example app listening on port 3000!'))