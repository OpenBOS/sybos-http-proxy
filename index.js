require('dotenv').config()

const httpProxy = require('http-proxy')
const fs = require('fs')
const path = require('path')

const isDevelopment = process.env.NODE_ENV !== 'production'

;(async () => {
    let ssl = {}

    if (isDevelopment) {
        ssl = {
            cert: fs.readFileSync(path.resolve(__dirname, './localhost.pem')),
            key: fs.readFileSync(path.resolve(__dirname, './localhost-key.pem')),
        }
    } else {
        let pkg = require('./package.json');
        let Greenlock = require('greenlock');

        let greenlock = Greenlock.create({
            configDir: './greenlock.d/config.json',
            packageAgent: pkg.name + '/' + pkg.version,
            maintainerEmail: pkg.author,
            staging: true,
            notify: function(event, details) {
                if ('error' === event) {
                    // `details` is an error object in this case
                    console.error(details);
                }
            }
        });

        const fullConfig = await greenlock.manager.defaults({
            agreeToTerms: true,
            subscriberEmail: 'webhosting@example.com'
        })

        var altnames = [process.env.HOST];

        await greenlock.add({
            subject: altnames[0],
            altnames: altnames
        })

        const pems = await greenlock.get({ servername: process.env.HOST })

        ssl = {
            cert: pems.cert,
            key: pems.privkey,
        }
    }

    const proxy = httpProxy.createProxyServer({
        target: 'https://sybos.ooelfv.at/',
        ssl,
        secure: false,
        xfwd: false,
        changeOrigin: true,
    })

    proxy.listen(process.env.PORT)
})()
