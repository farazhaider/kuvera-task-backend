var Datastore = require('nedb')
    , db = new Datastore({ filename: 'mf.db', autoload: true });

var csv = require('fast-csv')
var fs = require('fs')

var stream = fs.createReadStream("mf_data.csv");

var csvStream = csv
    .parse({ delimiter: ';' })
    .on("data", function (data) {
        insertRow(data);
    })
    .on("end", function () {
        console.log("done");
    });

stream.pipe(csvStream);

var insertRow = function (row) {
    var document = {
        mutual_fund_house: row[0]
        , mutual_fund_code: Number(row[1])
        , mutual_fund_name: row[2]
        , net_asset_value: Number(row[3])
        , date: new Date(row[6])
    };
    db.insert(document, function (err, newDoc) {
    });
}
