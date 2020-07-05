// Own implementation of https://tools.ietf.org/html/rfc7519
require('dotenv').config();
const TOKEN_EXPIRATION_TIME = 1000 * 60 * 60 * 24; // one day expiration
const EXPIRATION_TIMESTAMP = currentDatePlusExpiration();
const crypto = require('crypto');
const algorithmAndTokenType = {
    alg: 'HS512',
    typ: 'JWT'
}
function sign(data, expiration = EXPIRATION_TIMESTAMP) {
    let payload = { ...data, expiration };
    const headerAndPayload = `${encodeObject(algorithmAndTokenType)}.${encodeObject(payload)}`;
    return `${headerAndPayload}.${hashHeaderAndPayload(headerAndPayload)}`
}

function verify(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        notAuthorized(res);
        return;
    }
    const token = authHeader.split(' ')[1];
    let [header, payload, sign] = token.split('.');
    if (hashHeaderAndPayload(`${header}.${payload}`) !== sign) {
        notAuthorized(res);
    } else {
        const jsonPayload = JSON.parse(decodeObject(payload));
        if (Date.now() >= jsonPayload.expiration) {
            notAuthorized(res)
        } else {
            req.user = jsonPayload;
            next();
        }
    }
}

function notAuthorized(res) {
    res.status(401).json({ message: 'Not Authorized to access this content' })
}

function currentDatePlusExpiration() {
    return Date.now() + TOKEN_EXPIRATION_TIME;
}

function encodeObject(obj) {
    let encodedString = Buffer.from(JSON.stringify(obj)).toString('base64');
    return encodeString(encodedString);
    
}

function encodeString(notProperlyEncoded) {
    // following https://www.rfc-editor.org/rfc/rfc7515.txt Appendix C
    let stringToEncode = notProperlyEncoded.split('=')[0];
    stringToEncode = stringToEncode.replace('+', '-');
    stringToEncode = stringToEncode.replace('/', '_');
    return stringToEncode;
}

function decodeObject(base64String) {
    // following https://www.rfc-editor.org/rfc/rfc7515.txt
    let objectToBe = base64String.replace('-', '+');
    objectToBe = base64String.replace('_', '/');
    switch (objectToBe % 4) {
        case 0:
            break;
        case 2:
            objectToBe = objectToBe + '==';
            break;
        case 3:
            objectToBe = objectToBe + '=';
            break;
    }
    return Buffer.from(objectToBe, 'base64').toString("utf-8");
}

function hashHeaderAndPayload(headerAndPayload) {
    const hmac = crypto.createHmac('sha512', process.env.KEY);
    hmac.update(headerAndPayload);
    return encodeString(hmac.digest('base64'));
}

module.exports = {
    sign, verify
}