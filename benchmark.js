const jwt = require('jsonwebtoken')
const 
    rsaPriv = 
`-----BEGIN RSA PRIVATE KEY-----
MIIBOQIBAAJBAIy8nbdKGBgaDJSD1v86bsrCosGYTa6IaWN5O4iJ+kB1LMV1OazQ
sbQwIAfRZMLV1T8lq4tHoKV4t5ADuDbCfAkCAwEAAQJATmlgbhioJ/WLgMub5AQI
aova5oYW8eEq5rNLCh3mAjby6enclr3g736nr5ya9bistH9SdeZSykebnyi5Svy+
AQIhAMj0ss+X0NEmtOLI0uIHVB49fkNK9U4M9RRYKbeYE95hAiEAs0lF85BOTfiK
2ft54uvUQm7mOBrnw7UIPpc9rol3bqkCIHzpZbCWXK11UuDZFgR7q7T0YmSv1lVC
xqBzwNKnTEphAiBUbXcBgb0+PoK0sBXv5HpqZmsHlLP7l26weuxTGu0hMQIgZ21y
7iszqY/SP5Hrl46OuOXdouM9Hi6jtNgmI3aBjVY=
-----END RSA PRIVATE KEY-----`,
    rsaPub = 
`-----BEGIN PUBLIC KEY-----
MFwwDQYJKoZIhvcNAQEBBQADSwAwSAJBAIy8nbdKGBgaDJSD1v86bsrCosGYTa6I
aWN5O4iJ+kB1LMV1OazQsbQwIAfRZMLV1T8lq4tHoKV4t5ADuDbCfAkCAwEAAQ==
-----END PUBLIC KEY-----
`
const EC = require('secp256k1')
const crypto = require('crypto')

function getPublicKey(data, signature) {
    let dataHash = new Uint8Array(crypto.createHash('sha256').update(data).digest())
    let tmp = EC.ecdsaRecover(signature.rs, signature.recoveryParam, dataHash, false)
    // refers to doc here: https://github.com/cryptocoinjs/secp256k1-node/blob/master/API.md
    let recoveredPubKey = Buffer.from(tmp).toString('hex').substring(2)
    return recoveredPubKey
}

function verifyToken(token){
    let payload = jwt.verify(token, rsaPub, { algorithm: 'RS256' })
    return payload
}

async function main() {
    let priv = '66ce78475c92f7d0b8288cccf2ffa98d53202a53fd80dc3743fb4f423805c76c'
    let payload = {alias: 'tony'}
    let payload_str = JSON.stringify(payload)
    let signature = EC.ecdsaSign(new Uint8Array(crypto.createHash('sha256').update(payload_str).digest()), new Uint8Array(Buffer.from(priv, 'hex')))
    let token = jwt.sign(payload, rsaPriv, { algorithm: 'RS256' })

    let times = 10000
    // console.log('Signature:', signature.signature)
    let marked
    marked = Date.now()

    for(let i = 0; i<times; ++i) {
        getPublicKey(
            payload_str, 
            {
                rs: signature.signature,
                recoveryParam: signature.recid,    
            }
        )
    }
    
    console.log(`Public key recovering method over ${times}:`, Date.now()-marked)

    marked = Date.now()
    for(let i = 0; i<times;++i) {
        verifyToken(token)
    }
    
    console.log(`JWT verification over ${times}:`, Date.now()-marked)
}

main()