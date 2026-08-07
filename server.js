const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const memoryFilePath = path.join(__dirname, 'memory.json');

function loadMemory() {
    if (fs.existsSync(memoryFilePath)) {
        try {
            return JSON.parse(fs.readFileSync(memoryFilePath, 'utf8'));
        } catch (e) {
            return {};
        }
    }
    return {};
}

function saveMemory(memory) {
    fs.writeFileSync(memoryFilePath, JSON.stringify(memory, null, 2), 'utf8');
}

// DuckDuckGo üzerinden otonom araştırma motoru
async function searchTheWeb(query) {
    try {
        const fetch = (await import('node-fetch')).default;
        const response = await fetch(`https://api.duckduckgo.com/?q=${encodeURIComponent(query)}&format=json&no_html=1&skip_disambig=1`);
        const data = await response.json();
        
        if (data.AbstractText) {
            return data.AbstractText;
        } else if (data.RelatedTopics && data.RelatedTopics[0] && data.RelatedTopics[0].Text) {
            return data.RelatedTopics[0].Text;
        }
        return null;
    } catch (err) {
        return null;
    }
}

app.post('/api/chat', async (req, res) => {
    const rawMessage = req.body.message || "";
    const userMessage = rawMessage.toLowerCase().trim();
    
    let memory = loadMemory();

    // 1. Eğer daha önce öğrenmişse hafızadan yapıştırır
    if (memory[userMessage]) {
        return res.json({ reply: memory[userMessage] });
    }

    // 2. Hafızada yoksa, otonom olarak kendi araştırır!
    let researchResult = await searchTheWeb(rawMessage);

    if (researchResult) {
        // Bulduğu bilgiyi kendi hafızasına kaydeder (Artık bir daha aramaz, bilir)
        memory[userMessage] = researchResult;
        saveMemory(memory);
        return res.json({ reply: `Bunu bilmiyordum, hemen araştırdım ve öğrendim: ${researchResult}` });
    }

    // 3. Hiçbir yerde bulamazsa kendi mantığını yürütür
    const fallbackAnswers = [
        `"${rawMessage}" konusunda henüz bir veri bulamadım ama bunu kafama yazdım, araştıracağım.`,
        `Bu benim için yepyeni bir kavram... Üzerinde düşünüyorum.`,
        `Bunu ilk defa duyuyorum, ama öğreneceğim.`
    ];
    
    let reply = fallbackAnswers[Math.floor(Math.random() * fallbackAnswers.length)];
    res.json({ reply: reply });
});

app.listen(PORT, () => {
    console.log(`DENİZ OTONOM BEYİN AKTİF! Port: ${PORT}`);
});
