const express = require("express");
const Alpaca = require("@alpacahq/alpaca-trade-api");
const dotenv = require("dotenv");
const csv = require('csvtojson')
const getScore = require("./indexAlgorithm/getScore");
const getScores = require("./indexAlgorithm/getScores");
const app = express();
const PORT = process.env.PORT || 8000;

// Setup
dotenv.config();
app.set('view engine', 'pug')
app.use(express.static('public'))

const alpaca = new Alpaca({
    keyId: process.env.ALPACA_KEY,
    secretKey: process.env.ALPACA_SECRET,
    paper: true
});

app.get("/", async (req, res) => {
    const account = await alpaca.getAccount();
    res.render('index', {
        account: {
            ...account,
        }
    });
});

app.get("/score/:symbol", async (req, res) => {
    try{
        const {
            symbol
        } = req.params;
        const score = await getScore(symbol);

        res.status(200).send(`${score}`);
    }
    catch(err){
        res.status(err.status || 500).send(err.message);
    }
});

app.get("/update", async (req, res) => {
    try{
        
        let allSymbols = await csv().fromFile("./indexAlgorithm/allTickers.csv");
        allSymbols = allSymbols.map(s=>s.Symbol);
        const scores = await getScores(allSymbols);
        res.send(scores);
    }
    catch(err){
        res.send(err.status || 500).send(err.message);
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

/*
// Order code
const order = await alpaca.createOrder({
    symbol: "MSFT",
    notional: 1,
    side: "buy",
    type: "market",
    time_in_force: "day"
});
*/