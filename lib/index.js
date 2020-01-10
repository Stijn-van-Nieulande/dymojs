'use strict';

let fetcher;

if (typeof fetch === 'undefined') {
    fetcher = require('node-fetch');
} else {
    fetcher = fetch;
}

class Dymo {
    constructor(options) {
        options = options || {};

        this.hostname = options.hostname || '127.0.0.1';
        this.port = options.port || 41951;
        this.printerName = options.printerName;
    }

    get getApiUrl() {
        return `https://${this.hostname}:${this.port}/DYMO/DLS/Printing`;
    }

    get getPrinters() {
        if (typeof process !== 'undefined' && process.env) {
            process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'; // TODO: Bundle the certificates.
        }

        return fetcher(`${this.getApiUrl}/GetPrinters`)
            .then((response) => response.text());
    }

    print(printerName, labelXml, printParamsXml = '') {
        let label = `printerName=${encodeURIComponent(printerName)}&printParamsXml=${encodeURIComponent(printParamsXml)}&labelXml=${encodeURIComponent(labelXml)}&labelSetXml=`;

        if (typeof process !== 'undefined' && process.env) {
            process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'; // TODO: Bundle the certificates.
        }

        return fetcher(`${this.getApiUrl}/PrintLabel`,
            {
                method: 'POST',
                body: label,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            })
            .then((response) => response.text())
            .then((result) => result);
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = Dymo;
} else {
    window.Dymo = Dymo;
}
