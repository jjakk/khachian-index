const yahooStockAPI  = require('yahoo-stock-api');

const getScore = async (symbol) => {
    const { response: stock } = await yahooStockAPI.getSymbol(symbol);
    const {
        beta,
        peRatio,
        forwardDividendYield
    } = stock;

    const dividendYield = forwardDividendYield
        ? parseFloat(
            forwardDividendYield.match(/\(([^()]+)\)/g)[0]
            .replace("(", "")
            .replace(")", "")
            .replace("%", "")
        ) : null;

    const metrics = [
        {
            value: beta,
            min: 0,
            max: 2,
            weight: 10,
            greaterBetter: false,
        }, {
            value: peRatio,
            min: 0,
            max: 30,
            weight: 10,
            greaterBetter: false,
        }, {
            value: dividendYield,
            min: 0,
            max: 12,
            weight: 10,
            greaterBetter: true,
        }
    ];

    const score = sumMetricScores(metrics);
    const maxScore = metrics.reduce((t,m)=>{
        if(m.value === null) return t;
        else return m.weight + t;
    }, 0);

    return score/maxScore;
};

const sumMetricScores = (metrics) => {
    let score = 0;

    for(const metric of metrics){
        const {
            value,
            min,
            max,
            weight,
            greaterBetter
        } = metric;

        if(value === null) continue;

        let effect = (
            Math.max((value - min), 0)
            /
            (max - min)
        ) * weight;

        effect = greaterBetter
            ? effect
            : effect ** -1;
        
        score += effect;
    }

    return score;
};

module.exports = getScore;
