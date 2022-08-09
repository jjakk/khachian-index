const express = require("express");
const Alpaca = require("@alpacahq/alpaca-trade-api");
const dotenv = require("dotenv");
const getScore = require("./indexAlgorithm/getScore");
const getScores = require("./indexAlgorithm/getScores");
const app = express();
const PORT = process.env.PORT || 8000;

// Setup
dotenv.config();
app.set('view engine', 'pug')
app.use(express.static('public'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const alpaca = new Alpaca({
    keyId: process.env.ALPACA_KEY,
    secretKey: process.env.ALPACA_SECRET,
    paper: true
});

app.get("/", async (req, res) => {
    const account = await alpaca.getAccount();
    let positions = await alpaca.getPositions();
    positions = positions
        .sort((a,b) => b.market_value - a.market_value)
        .map(c=>{return{
            symbol: c.symbol,
            portfolioDiversity: ((c.market_value/account.portfolio_value)*100).toFixed(2)
        }});
    res.render('index', {
        topTenHoldings: positions.slice(0, 10)
    });
});

app.get("/customPortfolio", async (req, res) => {
    const account = await alpaca.getAccount();
    res.render('customPortfolio');
});

app.post("/customPortfolio", async (req, res) => {
    let { symbols } = req.body;
    symbols = symbols.split(",").map(c=>c.trim())
    const scores = await getScores(symbols);
    res.render('customPortfolio', {
        scores
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

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});