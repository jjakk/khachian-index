const express = require("express");
const Alpaca = require("@alpacahq/alpaca-trade-api");
const dotenv = require("dotenv");
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

app.put("/update", async (req, res) => {

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