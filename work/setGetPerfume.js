const vader = require('vader-sentiment');
const fs = require('fs');
const yaml = require('js-yaml');


function setupPerfumes(){
    let perfumes = []
    try {
        const fileName = 'fragrances.yaml'
        const fileContents = fs.readFileSync(fileName, 'utf8');
        const data = yaml.load(fileContents); // Parses the YAML file
        perfumes = data // Use the data as a JavaScript object
    } catch (e) {
        console.log(e);
    }
    perfumes = setScores(perfumes);
    return perfumes;
}

function setScores(perfumes){
    perfumes.forEach(perfume => {
        let fullMood = "feeling of"
        let baseNotes = ", with base notes of"
        let midNotes = ", with mid notes of"
        let topNotes = ", and top notes of"
        perfume.Moods.forEach(mood =>{
            fullMood += (" " + mood)
        })
        perfume["Base Notes"].forEach(base =>{
            baseNotes += (", " + base)
        })
        perfume["Middle Notes"].forEach(mid =>{
            midNotes += (", " + mid)
        })
        perfume["Top Notes"].forEach(top =>{
            topNotes += (", " + top)
        })
        const phrase = fullMood + baseNotes + midNotes + topNotes;
        const intensity = vader.SentimentIntensityAnalyzer.polarity_scores(phrase);    
        // {neg: 0.0, neu: 0.299, pos: 0.701, compound: 0.8545}
        //score represents the compounded score of all descriptors for the perfume. 
        perfume.score = intensity;
    })    
    return perfumes;
};

function getScore(prompt){
    return vader.SentimentIntensityAnalyzer.polarity_scores(prompt);
}

function getFrags(promptScore, perfumes, threshold = 0.015){
    let possible = []
    perfumes.forEach(perfume=> {
        let score = perfume.score.compound;
        const diff = Math.abs(score - promptScore.compound);
        if(diff <= threshold){
            let obj = {key: diff, value: perfume}
            possible.push(obj);
        }
    })
    //Sort by least differnce to most 
    possible.sort((a,b) => a.key - b.key)
    return possible;
}

const perfumes = setupPerfumes();

const prompt = "I am feeling happy and want to smell citrus and earth"
const promptScore = getScore(prompt);
console.log(JSON.stringify(promptScore));
const targetFrags = getFrags(promptScore, perfumes, 0.01);
console.log("These maybe a good fit for today: \n")
targetFrags.forEach((frag, i) => {
    console.log(`${i+1} : ${JSON.stringify(frag.value["Fragrance Name"])} - ${JSON.stringify(frag.value.score.compound)}\n`)
    console.log(`Mood: ${JSON.stringify(frag.value["Moods"])} - Base Notes : ${JSON.stringify(frag.value["Base Notes"])}\n`)
})
