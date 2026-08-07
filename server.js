const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Hafıza dosyası yolu (Geçmişi ve öğrendiklerini burada tutacak)
const memoryFilePath = path.join(__dirname, 'memory.json');

// Hafızayı yükleme veya oluşturma fonksiyonu
function loadMemory() {
    if (fs.existsSync(memoryFilePath)) {
        try {
            const data = fs.readFileSync(memoryFilePath, 'utf8');
            return JSON.parse(data);
        } catch (e) {
            return {};
        }
    }
    return {};
}

// Hafızaya kaydetme fonksiyonu
function saveMemory(memory) {
    fs.writeFileSync(memoryFilePath, JSON.stringify(memory, null, 2), 'utf8');
}

app.post('/api/chat', (req, res) => {
    const rawMessage = req.body.message || "";
    const userMessage = rawMessage.toLowerCase().trim();
    
    let memory = loadMemory();

    // Eğer kullanıcı bir şey öğretiyorsa (Örn: "şunu öğren: ... demektir" veya "öğren: elma bir meyvedir")
    if (userMessage.startsWith('öğren:') || userMessage.startsWith('şu ne demektir')) {
        // Öğretme formatı: "öğren: [anahtar] = [değer]"
        const parts = rawMessage.replace(/^(öğren:|şu ne demektir)\s*/i, '').split('=');
        if (parts.length === 2) {
            const key = parts[0].trim().toLowerCase();
            const val = parts[1].trim();
            memory[key] = val;
            saveMemory(memory);
            return res.json({ reply: `Anladım! Artık "${key}" sorulduğunda bunun "${val}" olduğunu biliyorum.` });
        } else {
            return res.json({ reply: "Hatalı format! Örnek kullanım: öğren: yapay zeka = düşünen makinelerdir şeklinde yazmalısın." });
        }
    }

    // Hafızada var mı diye kontrol et
    if (memory[userMessage]) {
        return res.json({ reply: memory[userMessage] });
    }

    // Eğer hafızada yoksa, bilmediğini itiraf etsin ve öğrenmek istesin
    res.json({ 
        reply: `Bunu henüz bilmiyorum. Bana öğretmek istersen şu formatta yazabilirsin:\n'öğren: ${userMessage} = [buraya cevabını yaz]'` 
    });
});

app.listen(PORT, () => {
    console.log(`DENİZ ÖĞRENEN BEYİN AKTİF! Port: ${PORT}`);
});
