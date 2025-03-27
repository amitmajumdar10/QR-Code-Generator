'use strict';

const qrcode = require('~/cartridge/libraries/qrcodegenerator/qrcode');

/**
 * Generate QR code SVG string
 * @param {string} data - Data to encode
 * @param {Object} [options] - Configuration options
 * @returns {string} - SVG XML string
 */
function generateQR(data, options) {
    var config = Object.assign({
        typeNumber: 10,
        errorCorrection: 'H',
        moduleSize: 4,
        margin: 2,
        foreground: '#000000',
        background: '#ffffff'
    }, options || {});

    if (!data || typeof data !== 'string') {
        throw new Error('Invalid QR code input data');
    }

    try {
        var qr = qrcode(config.typeNumber, config.errorCorrection);
        qr.addData(data);
        qr.make();
        
        return createSVG(qr, config);
    } catch (e) {
        throw new Error('QR generation failed: ' + e.message);
    }
}

/** @private Create SVG from QR matrix */
function createSVG(qr, config) {
    var moduleCount = qr.getModuleCount();
    var size = moduleCount * config.moduleSize + config.margin * 2;
    
    var svg = [
        '<svg xmlns="http://www.w3.org/2000/svg"',
        ' viewBox="0 0 ' + size + ' ' + size + '"',
        ' width="' + size + '" height="' + size + '">',
        '<rect width="100%" height="100%" fill="' + config.background + '"/>',
        '<path fill="' + config.foreground + '" d="'
    ];

    for (var row = 0; row < moduleCount; row++) {
        for (var col = 0; col < moduleCount; col++) {
            if (qr.isDark(row, col)) {
                var x = col * config.moduleSize + config.margin;
                var y = row * config.moduleSize + config.margin;
                svg.push('M' + x + ',' + y + 
                    'h' + config.moduleSize + 
                    'v' + config.moduleSize + 
                    'H' + x + 'V' + y + 'z');
            }
        }
    }
    
    svg.push('"/></svg>');
    return svg.join(' ');
}

module.exports = {
    generateQR: generateQR
};