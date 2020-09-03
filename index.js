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
    
async function main(){
    
    // generate
    let token = jwt.sign(
        { 
            alias: 'tony',
        }, 
        rsaPriv,
        {
            algorithm: 'RS256'
        }
    )

    console.log(
        'Generated jwt:',
        {
            token: token,
            length: token.length
        }
        
    )

    // verify
    var decoded = jwt.verify(token, rsaPub, {algorithms: 'RS256'})
    console.log('Decoded jwt payload:', decoded)
}

main()