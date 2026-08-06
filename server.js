const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// İnternetten bilgi arama fonksiyonu
async function searchTheWeb(query) {
    try {
        const fetch = (await import('node-fetch')).default;
        const response = await fetch(`https://api.duckduckgo.com/?q=${encodeURIComponent(query)}&format=json`);
        const data = await response.json();
        if (data.AbstractText) {
            return data.AbstractText;
        } else if (data.RelatedTopics && data.RelatedTopics[0]) {
            return data.RelatedTopics[0].Text;
        }
        return null;
    } catch (err) {
        return null;
    }
}

// Deniz'in hafızası ve düşünce motoru
app.post('/api/chat', async (expressReq, res) => {
    const userMessage = expressReq.body.message;
    
    let webInfo = null;
    if (userMessage.toLowerCase().includes('araştır') || userMessage.toLowerCase().includes('nedir') || userMessage.toLowerCase().includes('kimdir')) {
        webInfo = await searchTheWeb(userMessage);
    }

    let reply = `Söylediğin şey üzerine düşünülebilir ama beni yönlendirmeye mi çalışıyorsun yoksa öylesine mi konuşuyoruz?`;
    
    if (webInfo) {
        reply = `Bunu senin için araştırdım, ulaştığım bilgi şu: "${webInfo}". Bu konuda sen ne düşünüyorsun?`;
    }

    res.json({ reply: reply });
});

app.listen(PORT, () => {
    console.log(`========================================`);
    console.log(`YENİ BİLİNÇ MOTORU AKTİF! Port: ${PORT}`);
    console.log(`========================================`);
});
