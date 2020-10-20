const express = require('express')
const Web3 = require('web3')
var bodyParser = require('body-parser')
const url = 'https://mainnet.infura.io/v3/f210afee3948442382ec32a737eec565'
const web3 = new Web3(url)
const port = 3000
const eth = web3.eth
const utils = web3.utils

var appExpress = express();

appExpress.use(bodyParser.json());

/*
1) Account Transfers
Should give details about account transfers
Input address with value,
Output address with value
*/
appExpress.get('/eth/api/v1/transaction/:txHash', (req, res) => {
    const txHash = req.params.txHash;
    eth.getTransaction(txHash, function (err, op) {

        if (!err) {
            res.send({
                "block": {
                    "blockHeight": op.blockNumber
                },
                "outs": [
                    {
                        "address": op.to,
                        "value": (utils.fromWei(op.value, 'wei'))
                    }
                ],
                "ins": [
                    {
                        "address": op.from,
                        "value": "-" + (web3.utils.fromWei(op.value, 'wei'))
                    }
                ],
                "hash": op.hash,
                "currency": "ETH",
                "chain": "ETH.main",
                "state": "confirmed",
                "depositType": "account"
            })
        } else {
            console.log('Error!', err);
        }
    })
})

// 2. Erc20 Token transfers

appExpress.get('/eth/api/v1/erc20/:erc20Hash', (req, res) => {
    const erc20Hash = req.params.erc20Hash;
    eth.getTransaction(erc20Hash, function (err, ercop) {

        if (!err) {
        var inpData = ercop.input;
        var erc20_str = inpData.toString(16);

        var toAddress = erc20_str.slice(34, 74);
        var amount = erc20_str.slice(75, 138);

            res.send({
                "block": {
                    "blockHeight": ercop.blockNumber
                },
                "outs": [
                    {
                        "address": '0x'+ toAddress,
                        "value": (utils.fromWei(amount, 'wei')),
                        "type": "token",
                        "coin_specific": {
                            "tokenAddress": ercop.to
                        }
                    }
                ],
                "ins": [
                    {
                        "address": ercop.from,
                        "value": "-" + (web3.utils.fromWei(amount, 'wei')),
                        "type": "token",
                        "coin_specific": {
                            "tokenAddress": ercop.to
                        }
                    }
                ],
                "hash": ercop.hash,
                "currency": "ETH",
                "chain": "ETH.main",
                "state": "confirmed",
                "depositType": "contract"
            })
        } else {
            console.log('Error!', err);
        }
    })
})

// 3. Contract Execution

appExpress.get('/eth/api/v1/contract/:conAddress', (req, res) => {
    const conAddress = req.params.conAddress;
    eth.getTransaction(conAddress, function (err, contop) {

        if (!err) {
        var inpData = contop.input;
        var erc20_str = inpData.toString(16);

        var toAddress = erc20_str.slice(34, 74);
        var amount = erc20_str.slice(75, 138);

            res.send({
                "block": {
                    "blockHeight": contop.blockNumber
                },
                "outs": [
                    {
                        "address": '0x'+ toAddress,
                        "value": (utils.fromWei(amount, 'wei')),
                        "type": "transfer",
                        "coin_specific": {
                            "traceHash": contop.hash
                        }
                    }
                ],
                "ins": [
                    {
                        "address": contop.from,
                        "value": "-" + (web3.utils.fromWei(amount, 'wei')),
                        "type": "transfer",
                        "coin_specific": {
                            "traceHash": contop.hash
                        }
                    }
                ],
                "hash": contop.hash,
                "currency": "ETH",
                "chain": "ETH.main",
                "state": "confirmed",
                "depositType": "contract"
            })
        } else {
            console.log('Error!', err);
        }
    })
})


appExpress.listen(port, () => console.log(`Application listening on http://localhost:${port}`))

