const getScore = require('./getScore');

const getScores = async (symbols) => {
    let scores = [];
    for(symbol of symbols){
        let currentScore = await getScore(symbol);
        currentScore = isNaN(currentScore) ? null : currentScore;
        scores.push({
            symbol,
            score: currentScore
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