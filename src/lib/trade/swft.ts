
const crypto = require('crypto');
const axios = require('axios');
const { group } = require('console');

function getRandomArbitrary(min, max, precision) {
    var random = Math.random() * (max - min) + min;
    return parseFloat(random.toFixed(precision));
}

function calculateHMAC(key, data) {
    const hmac = crypto.createHmac('sha256', key);
    hmac.update(data);
    return hmac.digest('hex');
}

const api_url = 'https://www.swftc.info'
const channel_id = 'FREN20230726LxirlLKxlk4kGGlix'
const channel_secret = 'Vlxo84kGEAlkcxih43hGKNlxcivh43iuGBxkGKuxhvui4k'

async function sellOrder() {
    let sellAmount = getRandomArbitrary(7890000, 12500000, 4)
    let spRand = getRandomArbitrary(13901, 21088, 0)

    let sellPrice = "0.00000" + spRand
    var ts = new Date().getTime()

    var map = {
        channelId: channel_id,
        timestamp: ts,
        tradePair: "FREN(BSC)/USDT",
        type: "sell",
        amount: sellAmount,
        price: sellPrice
    }

    var sign = "amount=" + sellAmount + "&channelId=" + channel_id + "&price=" + sellPrice + "&timestamp=" + ts + "&tradePair=" + map.tradePair + "&type=" + map.type
    sign = sign + "&secret=" + channel_secret
    sign = calculateHMAC(channel_secret, sign).toUpperCase()
    
    map.sign = sign

    let uri = api_url + "/marketApi/trade"

    try {
        const response = await axios.post(uri, map);
        return response.data
    } catch(e) {
        console.log("错误", e)
        return {}
    }
}

async function groupSell() {
    for(let i=0; i<200; i++) {
        var ret = await sellOrder()
        console.log(ret)
    }
}

groupSell()
