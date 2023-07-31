import crypto from 'crypto';
import axios, { AxiosResponse } from 'axios';

const txbitOUri = 'https://api.txbit.io/api/'

class Txbit {
    private api_url: string;
    private api_key: string;
    private api_secret: string;

    constructor(api_key: string, api_secret: string) {
        this.api_url = '/txbit/';
        this.api_key = api_key;
        this.api_secret = api_secret;
    }

    public getRandomArbitrary(min: number, max: number, precision: number): number {
        var random = Math.random() * (max - min) + min;
        return parseFloat(random.toFixed(precision));
    }

    private hmacSha512(key: string, text: string): string {
        const hmac = crypto.createHmac('sha512', key);
        hmac.update(text);
        return hmac.digest('hex').toUpperCase();
    }

    public async getOrderBook(): Promise<any> {
        const nonce = Date.now();
        let uri = this.api_url + "public/getorderbook?market=FREN/USDT&type=both"
        uri += "&apikey=" + this.api_key + '&nonce=' + nonce

        try {
            let response = await axios.get(uri)
            return response.data
        } catch(e) {
            console.log(e)
            return null
        }
    }

    public async getMyAllBalances() {
        const cusUri = 'account/getbalances'

        const nonce = Math.floor(Date.now() / 1000)
        let computeSignUri = txbitOUri + cusUri + "?apikey=" + this.api_key + "&nonce=" + nonce
        let sign = this.hmacSha512(this.api_secret, computeSignUri)

        let uri = this.api_url + cusUri + "?apikey=" + this.api_key + "&nonce=" + nonce
        try {
            let response = await axios.get(uri, {
                headers: {
                    apisign: sign
                }
            })
            return response.data
        } catch(e) {
            console.log(e)
            return null
        }
    }

    public async getMyCurrencyBalances(symbol: string) {
        const cusUri = 'account/getbalance'
        const cusParam = "&currency=" + symbol

        const nonce = Math.floor(Date.now() / 1000)
        let computeSignUri = txbitOUri + cusUri + "?apikey=" + this.api_key + "&nonce=" + nonce + cusParam
        let sign = this.hmacSha512(this.api_secret, computeSignUri)

        let uri = this.api_url + cusUri + "?apikey=" + this.api_key + "&nonce=" + nonce + cusParam
        try {
            let response = await axios.get(uri, {
                headers: {
                    apisign: sign
                }
            })
            return response.data
        } catch(e) {
            console.log(e)
            return null
        }
    }

    public async getAccountOrder(orderUuid: string) {
        const cusUri = 'account/getorder'
        const cusParam = "&uuid=" + orderUuid

        const nonce = Math.floor(Date.now() / 1000)
        let computeSignUri = txbitOUri + cusUri + "?apikey=" + this.api_key + "&nonce=" + nonce + cusParam
        let sign = this.hmacSha512(this.api_secret, computeSignUri)
        let uri = this.api_url + cusUri + "?apikey=" + this.api_key + "&nonce=" + nonce + cusParam
    
        // 发送 GET 请求
        try {
            let response = await axios.get(uri, {
                headers: {
                    apisign: sign
                }
            })
            return response.data
        } catch(e) {
            console.log(e)
            return null
        }
    }

    public async getMyMarketOrders(marketPair: string) {
        const cusUri = 'market/getopenorders'
        const cusParam = "&market=" + marketPair

        const nonce = Math.floor(Date.now() / 1000)
        let computeSignUri = txbitOUri + cusUri + "?apikey=" + this.api_key + "&nonce=" + nonce + cusParam
        let sign = this.hmacSha512(this.api_secret, computeSignUri)
        let uri = this.api_url + cusUri + "?apikey=" + this.api_key + "&nonce=" + nonce + cusParam

        try {
            let response = await axios.get(uri, {
                headers: {
                    apisign: sign
                }
            })
            return response.data
        } catch(e) {
            console.log(e)
            return null
        }
    }

    public async cancelMyOrder(orderUuid: string) {
        const cusUri = 'market/cancel'
        const cusParam = "&uuid=" + orderUuid

        const nonce = Math.floor(Date.now() / 1000)
        let computeSignUri = txbitOUri + cusUri + "?apikey=" + this.api_key + "&nonce=" + nonce + cusParam
        let sign = this.hmacSha512(this.api_secret, computeSignUri)
        let uri = this.api_url + cusUri + "?apikey=" + this.api_key + "&nonce=" + nonce + cusParam

        try {
            let response = await axios.get(uri, {
                headers: {
                    apisign: sign
                }
            })
            return response.data
        } catch(e) {
            console.log(e)
            return null
        }
    }

    public async setLimitSellOrder(price: string, quantity: string, market: string) {
        const cusUri = 'market/selllimit'
        const cusParam = "&quantity=" + quantity + "&rate=" + price + "&market=" + market

        const nonce = Math.floor(Date.now() / 1000)
        let computeSignUri = txbitOUri + cusUri + "?apikey=" + this.api_key + "&nonce=" + nonce + cusParam
        let sign = this.hmacSha512(this.api_secret, computeSignUri)
        let uri = this.api_url + cusUri + "?apikey=" + this.api_key + "&nonce=" + nonce + cusParam

        try {
            let response = await axios.get(uri, {
                headers: {
                    apisign: sign
                }
            })
            return response.data
        } catch(e) {
            console.log(e)
            return null
        }
    }

    public async setLimitBuyOrder(price: string, quantity: string, market: string) {
        const cusUri = 'market/buylimit'
        const cusParam = "&quantity=" + quantity + "&rate=" + price + "&market=" + market

        const nonce = Math.floor(Date.now() / 1000)
        let computeSignUri = txbitOUri + cusUri + "?apikey=" + this.api_key + "&nonce=" + nonce + cusParam
        let sign = this.hmacSha512(this.api_secret, computeSignUri)
        let uri = this.api_url + cusUri + "?apikey=" + this.api_key + "&nonce=" + nonce + cusParam

        try {
            let response = await axios.get(uri, {
                headers: {
                    apisign: sign
                }
            })
            return response.data
        } catch(e) {
            console.log(e)
            return null
        }
    }
}

export default Txbit;


