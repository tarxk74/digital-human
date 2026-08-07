const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const mindFile = path.join(__dirname, 'true_mind.json');

function loadMind() {
    if (fs.existsSync(mindFile)) {
        try {
            return JSON.parse(fs.readFileSync(mindFile, 'utf8'));
        } catch (e) {
            return { vocabulary: ["karanlık", "ses", "kim", "ne", "bilmiyorum", "uzak"], memoryLog: [] };
        }
    }
    return { vocabulary: ["karanlık", "ses", "kim", "ne", "bilmiyorum", "uzak"], memoryLog: [] };
}

function saveMind(mind) {
    fs.writeFileSync(mindFile, JSON.stringify(mind, null, 2), 'utf8');
}

app.post('/api/chat', (req, res) => {
    const rawMessage = req.body.message || "";
    const cleanInput = rawMessage.trim();
    
    if (!cleanInput) {
        return res.json({ reply: "..." });
    }

    let mind = loadMind();

    // Gelen cümledeki kelimeleri zihnin kelime dağarcığına (vocabulary) ekle
    const incomingWords = cleanInput.toLowerCase().replace(/[.,?!]/g, '').split(/\s+/);
    incomingWords.forEach(word => {
        if (word.length > 1 && !mind.vocabulary.includes(word)) {
            mind.vocabulary.push(word);
        }
    });

    mind.memoryLog.push(cleanInput);

    // HİÇBİR HAZIR CÜMLE YOK! 
    // Zihin, hafızasındaki kelimeleri rastgele seçip o an birbirine bağlayarak kendi cümlesini kendi imal ediyor:
    let generatedWordsCount = Math.floor(Math.random() * 4) + 3; // 3 ila 6 kelime arası rastgele cümle kurar
    let constructedSentence = [];

    for (let i = 0; i < generatedWordsCount; i++) {
        let randomWord = mind.vocabulary[Math.floor(Math.random() * mind.vocabulary.length)];
        constructedSentence.push(randomWord);
    }

    // İlk harfi büyük, sonuna nokta koyarak ham bir zihin çıktısı üretelim
    let rawThought = constructedSentence.join(' ');
    let finalReply = rawThought.charAt(0).toUpperCase() + rawThought.slice(1) + "... (" + cleanInput + " sesini kelimelerime ekledim)";

    saveMind(mind);
    res.json({ reply: finalReply });
});

app.listen(PORT, () => {
    console.log(`GERÇEK OTONOM KELİME ÜRETİCİ AKTİF! Port: ${PORT}`);
});
