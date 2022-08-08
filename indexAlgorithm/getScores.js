const getScore = require('./getScore');

const getScores = async (symbols) => {
    let scores = [];
    for(symbol of symbols){
        scores.push({
            symbol,
            score: await getScore(symbol)
        });
    };
    return scores;
};

module.exports = getScores;