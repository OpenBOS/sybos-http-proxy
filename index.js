require('dotenv').config()

const httpProxy = require('http-proxy')
const fs = require('fs')
const path = require('path')
const isDevelopment = process.env.NODE_ENV !== 'production'

;(async () => {
    const proxy = httpProxy.createProxyServer({
        target: 'https://sybos.ooelfv.at/sybServices',
        ssl: {
            cert: fs.readFileSync(path.resolve(process.env.SSL_CERT)),
            key: fs.readFileSync(path.resolve(process.env.SSL_KEY)),
        },
        secure: false,
        xfwd: false,
        changeOrigin: true,
    })

    proxy.listen(process.env.PORT)

    console.log(`Listening to ${process.env.PORT}`)
})()
