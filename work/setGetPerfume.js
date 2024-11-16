const vader = require('vader-sentiment');
const fs = require('fs');
const yaml = require('js-yaml');
const natural = require('natural');
const tokenizer = new natural.WordTokenizer();


function getCosineSimilarity(str1, str2){
    const tokens1 = tokenizer.tokenize(str1.toLowerCase())
    const tokens2 = tokenizer.tokenize(str2.toLowerCase())
    
    const tfidf = new natural.TfIdf();
    console.log(tokens1);
    
    tfidf.addDocument(tokens2);
     // Pass a callback function to handle the TF-IDF scores
    const scores = [];
    tfidf.tfidfs(0, function(i, score, key) {
        // Collect the scores and the associated words (terms)
        scores.push({ term: key, score: score });
    });
   
    return scores;
}

//cosine similarity between 2 strings
function similarity(perfumes, prompt){
    let mostSimilar = [-1,{}]
    perfumes.forEach(perfume => {
        const perfumeDesc = getDescription(perfume);  
        const score = getCosineSimilarity(perfumeDesc, prompt);
        if(score > mostSimilar[0]){
            mostSimilar[0] = score;
            mostSimilar[1] = perfume;
        }
    })
    return mostSimilar;
}


function getDescription(perfume){
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
    return phrase;
}

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
        const phrase = getDescription(perfume);
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

function vaderSent(perfumes,prompt){
    const promptScore = getScore(prompt);  
    console.log(JSON.stringify(promptScore));
    const targetFrags = getFrags(promptScore, perfumes, 0.015);
    console.log("These maybe a good fit for today: \n")
    targetFrags.forEach((frag, i) => {
        console.log(`${i+1} : ${JSON.stringify(frag.value["Fragrance Name"])} - ${JSON.stringify(frag.value.score.compound)}\n`)
        console.log(`Mood: ${JSON.stringify(frag.value["Moods"])} - Base Notes : ${JSON.stringify(frag.value["Base Notes"])}\n`)
    })
}

function mapPrompt(prompt, stopwords){
    const wordnet = new natural.WordNet();
    prompt = prompt.split(/\W+/);
    let wordCount = new Map();
    prompt.forEach(word => {
        word = word.toLowerCase();
        if(word.length > 0 && stopwords.has(word) === false){
            wordCount.set(word, (wordCount.get(word) || 0)+1);
        }
    })
    return wordCount;
}

function setupStopwords(){
    //exclude stopwords and words within a fragrance prompt.
    const sw = natural.stopwords;
    let stopwords = new Set();
    sw.forEach(word => {
        stopwords.add(word);
    })
    stopwords.add("notes").add("note").add("base").add("mid").add("middle").add("feeling").add("top");
    return stopwords;
}

function compare(perfumes, prompt){
    const stopwords = setupStopwords();
    //compare the keywords in prompt to the key words of a fragrance
    //tokenize the words of the prompt.
    //clean up the prompt
    prompt = mapPrompt(prompt, stopwords);
    console.log(prompt)
    //tokenize the words of the fragrance. 
    perfumes.forEach(perfume =>{
        let desc = getDescription(perfume);
        desc = mapPrompt(desc, stopwords);
        //keep score of how many words are exactly the same words in the prompt.
        //prioritize the higher scores.
        //if none, use vader sentiment. 
    })
    
}
const perfumes = setupPerfumes();

const prompt = "I want to feel energized,sleepy, and focused for the day. energy. energetic"
/*
const result = similarity(perfumes, prompt);
console.log(result);
*/

compare(perfumes, prompt);

const wordnet = new natural.WordNet();

// Lemmatizing the word "running" (verb form)
wordnet.lookup('energetic', function(results) {
    console.log(results[0]);
});

/*
Going to transition this functionality into python as it has a better
lemmatization mechanics so I can accuratly find the root words in prompts.
*/