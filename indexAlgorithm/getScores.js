const getScore = require('./getScore');

const getScores = async (symbols) => {
    let scores = [];
    for(symbol of symbols){
        scores.push({
            symbol,
            score: await getScore(symbol)
        });
    };
    scores = scores.sort((a,b)=>
        (b.score || 0)
        -
        (a.score || 0)
    );
    return scores;
};

module.exports = getScores;