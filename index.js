const https = require('https')
const httpProxy = require('http-proxy')
const fs = require('fs')
const path = require('path')

const proxy = httpProxy.createProxyServer({
    target: 'https://sybos.ooelfv.at/',
    ssl: {
        cert: fs.readFileSync(path.resolve(__dirname, './localhost.pem')),
        key: fs.readFileSync(path.resolve(__dirname, './localhost-key.pem')),
    },
    secure: false,
    xfwd: false,
    changeOrigin: true,
})

proxy.listen(10000)
