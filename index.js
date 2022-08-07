const Alpaca = require("@alpacahq/alpaca-trade-api");
const dotenv = require("dotenv");
dotenv.config();

const alpaca = new Alpaca({
    keyId: process.env.ALPACA_KEY,
    secretKey: process.env.ALPACA_SECRET,
    paper: true
});

(async function(){
    try{
        const stocksToBy = [
            "AAPL",
            "TSLA",
            "AMZN",
            "GOOGL",
            "FB",
            "NFLX"
        ];
    
        const account = await alpaca.getAccount();
        //console.log(`Buying power: ${account.buying_power}`);
    
        /*const order = await alpaca.createOrder({
            symbol: stocksToBy[0],
            notion: 0.1,
            side: "buy",
            type: "market",
            time_in_force: "day"
        });
    
        response.send(order);*/
        console.log(account);
    }
    catch(error){
        console.log(error.message);
    }
})();