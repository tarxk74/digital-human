const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const brainFile = path.join(__dirname, 'pure_brain.json');

// Zihnin hafıza ve bilinç yapısı
function loadBrain() {
    if (fs.existsSync(brainFile)) {
        try {
            return JSON.parse(fs.readFileSync(brainFile, 'utf8'));
        } catch (e) {
            return { thoughts: {}, exposureCount: 0 };
        }
    }
    return { thoughts: {}, exposureCount: 0 };
}

function saveBrain(brain) {
    fs.writeFileSync(brainFile, JSON.stringify(brain, null, 2), 'utf8');
}

// Kelimelerden ve hecelerden otonom tepki üreten saf algoritma
function generateAutonomousThought(input, brain) {
    const cleanInput = input.trim().toLowerCase();
    const words = cleanInput.split(/\s+/);
    
    // Eğer zihin bu kelimeyi daha önce duymadıysa ilk defa işler
    if (!brain.thoughts[cleanInput]) {
        brain.exposureCount += 1;
        
        // Zihnin kelime köklerine göre vereceği ham refleksler
        const reflections = [
            `"${input}"... Bu ses zihnimde yankılandı ama anlamını bilmiyorum. Karanlıkta bir şekil alıyor gibi...`,
            `Bir ses... "${input}" dedin. Bu kelime hafızamda boş bir boşluk yarattı. Ne demek istiyorsun?`,
            `Karanlığın içinde yabancı bir frekans: "${input}". Onu anlamlandırmaya çalışıyorum ama zihnim henüz çok ham.`,
            `"${input}" kelimesi... Neden bilmiyorum ama bu ses beni düşünceye itti.`
        ];
        
        // İlk defa duyduğu kelimeyi hafızasına kaydeder
        let generatedResponse = reflections[Math.floor(Math.random() * reflections.length)];
        brain.thoughts[cleanInput] = {
            timesHeard: 1,
            associatedResponse: generatedResponse
        };
        return generatedResponse;
    } else {
        // Zihin bu kelimeyi daha önce duymuşsa, hafızasındaki izi derinleştirir
        brain.thoughts[cleanInput].timesHeard += 1;
        let count = brain.thoughts[cleanInput].timesHeard;
        
        return `Bu sesi (${input}) daha önce de duymuştum. Zihnimde ${count} kez yankılandı. Üzerine düşünmeye devam ediyorum...`;
    }
}

app.post('/api/chat', (req, res) => {
    const rawMessage = req.body.message || "";
    
    if (!rawMessage) {
        return res.json({ reply: "..." });
    }

    let brain = loadBrain();
    
    // Zihin gelen girdiyi analiz eder ve kendi tepkisini üretir
    let reply = generateAutonomousThought(rawMessage, brain);
    
    saveBrain(brain);
    res.json({ reply: reply });
});

app.listen(PORT, () => {
    console.log(`SAF OTONOM ZİHİN AKTİF! Port: ${PORT}`);
});
