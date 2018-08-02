console.log('starting app.');

const https = require('https');
const fs = require('fs');


var url = 'https://s3-us-west-2.amazonaws.com/public.cyan-agro.com/data.csv';
var filename = 'data' + (+new Date()) + '.csv';
var file = fs.createWriteStream(filename);

var countFile = function (file) {
    console.log('starting count process.', new Date().toLocaleTimeString());
    const readline = require('readline');
    const stream = require('stream');

    var inStream = fs.createReadStream(file);
    var outStream = new stream;

    var rows = 0;
    var tipAmount = 0;
    var firstLine = false;
    var index = 0;
    var tipText = ''

    var fileRead = readline.createInterface(inStream, outStream)
        .on('line', function (line) {
            if (!firstLine) {
                firstLine = true;
                index = line.split(',').indexOf('tip_amount');
            } else {
                tipText = line.split(',')[index];
                if (tipText) {
                    rows++;
                    tipAmount += parseFloat(tipText);
                }
            }
        }).on('close', function () {
            console.log('\nTotal de linhas:', rows, '\nValor medio (tip_amount):', (tipAmount / rows).toFixed(2), '\nSoma:', tipAmount.toFixed(2));
            console.log('\nfinished count process.', new Date().toLocaleTimeString());
        });
};

var request = https.get(url, (res) => {
    console.log('statusCode:', res.statusCode);
    console.log('total file size:', res.headers['content-length']);
    console.log('downloading.', new Date().toLocaleTimeString());

    res.on('data', (d) => {
        file.write(d);
    });

    res.on('end', (d) => {
        console.log('download finished.', new Date().toLocaleTimeString());
        countFile(filename);
    });
}).on('error', (e) => {
    console.error(e);
});
