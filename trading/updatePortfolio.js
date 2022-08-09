const Alpaca = require("@alpacahq/alpaca-trade-api");
const csv = require('csvtojson');
const getScores = require('../indexAlgorithm/getScores');

const alpaca = new Alpaca({
    keyId: process.env.ALPACA_KEY,
    secretKey: process.env.ALPACA_SECRET,
    paper: true
});

(async function(){
    try{
        const account = await alpaca.getAccount();
        const buyingPower = account.non_marginable_buying_power;
        let allSymbols = await csv().fromFile("./indexAlgorithm/allTickers.csv");
        allSymbols = allSymbols
            .sort((a,b) => parseInt(b["Market Cap"] || 0) - parseInt(a["Market Cap"] || 0))
            .map(s=>s.Symbol)
            .slice(0,100);
        let scores = await getScores(allSymbols);
        await alpaca.closeAllPositions();
        const scoreSum = scores.reduce((t,b)=>t+parseFloat(b.score || 0),0);
        for(const score of scores){
            const portfolioDiversity = (score.score||0)/scoreSum;
            const order = await alpaca.createOrder({
                symbol: score.symbol,
                notional: portfolioDiversity*buyingPower,
                side: "buy",
                type: "market",
                time_in_force: "day"
            });
            console.log(`${order.symbol}, ${order.notional}`);
        }
    }
    catch(err){
        console.log(err.message);
    }
})();