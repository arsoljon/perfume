import spacy
nlp = spacy.load("en_core_web_md")

doc = nlp("SpaCy is an NLP library in Python.")

import yaml
    

def setupPerfumes():
    filename = '../fragrances.yaml'
    # Open the YAML file and load the data
    with open(filename, 'r') as file:
        data = yaml.safe_load(file)
    return data

def setPerfumePrompt(perfume):
    namePrompt = "Name: {}.".format(perfume['Fragrance Name'])
    moodPrompt = " Moods like"
    basePrompt = " Base notes of"
    topPrompt = " Top notes of"
    midPrompt = " Middle notes of"
    for i, mood in enumerate(perfume['Moods']):
        if (i+1) < len(perfume['Moods']):
            moodPrompt += " {},".format(mood)
        else:
            moodPrompt += " {}.".format(mood)
    for i, base in enumerate(perfume['Base Notes']):
        if (i+1) < len(perfume['Base Notes']):
            basePrompt += " {},".format(base)
        else:
            basePrompt += " {}.".format(base)
    for i, top in enumerate(perfume['Top Notes']):
        if (i+1) < len(perfume['Top Notes']):
            topPrompt += " {},".format(top)
        else:
            topPrompt += " {}.".format(top)
    for i, mid in enumerate(perfume['Middle Notes']):
        if (i+1) < len(perfume['Middle Notes']):
            midPrompt += " {},".format(mid)
        else:
            midPrompt += " {}.".format(mid)
    result = namePrompt + moodPrompt + basePrompt + topPrompt + midPrompt
    return result
    
def setDoc(prompt):
    stopwords = nlp.Defaults.stop_words
    custom_stopwords = ['like', 'mood', 'moods', 'top', 'base', 'mid', 'middle', 'note', 'notes']
    for word in custom_stopwords:
        stopwords.add(word)
    prompt = prompt.lower()
    prompt = nlp(prompt)
    #remove punctuations, stopwords, and only include words with vectors
    prompt = [token.text.lower() for token in prompt if token.has_vector and not token.is_punct and not token.is_stop]
    prompt = spacy.tokens.Doc(nlp.vocab, words=prompt)
    #p1 = nlp(prompt[5])
    #p2 = nlp(prompt[6])
    #print("{} and {} are this similar: {}".format(p1, p2, p1.similarity(p2)))
    return prompt

def similarPerfumes(userPrompt, perfumes, thresholdMax = 0.85, thresholdMin = 0.5, thresholdChange = 0.01, maxSim = 6):
    userDoc = setDoc(userPrompt)
    mostSimilar = []
    tempPerfumes = perfumes
    while(len(mostSimilar) <= maxSim and thresholdMax > thresholdMin):
        for perfume in tempPerfumes:
            perfumePrompt = setPerfumePrompt(perfume)
            perfumeDoc = setDoc(perfumePrompt)
            #calculate similarity between user prompt and perfume prompt
            result = userDoc.similarity(perfumeDoc)
            if(result >= thresholdMax):
                mostSimilar.append(perfume)
                tempPerfumes.remove(perfume)
        thresholdMax -= thresholdChange
    #print results
    for i, perfume in enumerate(mostSimilar):
        perfumePrompt = setPerfumePrompt(perfume)
        print("{}: {}".format(i, perfumePrompt))
    return mostSimilar
    
perfumes = setupPerfumes()
perfumePrompt = setPerfumePrompt(perfumes[1])
userPrompt = "I want to smell like a citrusy citrus orange and a lavenderish lavender grape. Don't forget the citrus."

userDict = setDoc(userPrompt)
perfumeDict = setDoc(perfumePrompt)

mostSimilar = similarPerfumes(userPrompt, perfumes)
