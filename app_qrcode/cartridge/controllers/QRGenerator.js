'use strict';
var server = require('server');
const Logger = require('dw/system/Logger');
var qrService = require('~/cartridge/scripts/qrcode/qrGenerator');

server.get('Render', function (req, res, next) {
    var data = req.querystring.data || '';
    var svg = '';
    
    try {
        svg = qrService.generateQR(data, {
            moduleSize: 5,
            foreground: '#2a2c2e',
            margin: 4
        });
    } catch (e) {
        Logger.error('QR Generation Error: ' + e.toString());
    }

    res.setContentType('image/svg+xml');
    res.print(svg);
    next();
});

server.get('RenderInTemplate', function (req, res, next) {
    var qrData = req.querystring.data || '';
    res.render('qrcode/qrcode', {
        qrData : qrData
    });
    next();
});

module.exports = server.exports();