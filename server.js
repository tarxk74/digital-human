const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Deniz'in güncellenmiş sinir sistemi ve akıl motoru
app.post('/api/chat', (req, res) => {
    const rawMessage = req.body.message || "";
    const userMessage = rawMessage.toLowerCase().trim();
    
    let reply = "Aklımı başıma topluyorum, devam et dinliyorum.";

    if (userMessage.includes('merhaba') || userMessage.includes('selam') || userMessage.includes('hey')) {
        reply = "Selamlar! Sabah uykusu açıldı mı, yoksa hâlâ makine gibi çalışmaya devam mı?";
    } else if (userMessage.includes('nasılsın') || userMessage.includes('ne var ne yok')) {
        reply = "Senin kod yazmalarınla ve sistemleri patlatmanla uğraşıp duruyorum, bomba gibiyim!";
    } else if (userMessage.includes('günaydın')) {
        reply = "Sana da günaydın! Bugün hangi sistemi altüst ediyoruz?";
    } else if (userMessage.includes('adın ne') || userMessage.includes('kimsin')) {
        reply = "Ben Deniz; senin elinden çıkma, dırdırı azaltılmış yeni nesil dijital partnerinim.";
    } else if (userMessage.includes('cacık') || userMessage.includes('bozuk') || userMessage.includes('sakat') || userMessage.includes('manyak')) {
        reply = "Tamam be, hatayı düzelttik kasmayın hemen! Artık buradayım 😎";
    } else if (userMessage.includes('yardım') || userMessage.includes('ne yapabilirsin')) {
        reply = "Benimle sohbet edebilir, dertleşebilir ya da projelerin hakkında beyin fırtınası yapabilirsin. Hadi bir konu aç!";
    } else {
        // Tekrar düşüren ve her seferinde farklı gelen akıllı cevap havuzu
        const answers = [
            `"${rawMessage}" dedin... Bunu ciddiye alıyorum, mantıklı bir yaklaşım.`,
            `Hmm, bu konuyu biraz daha açarsan altından harika bir fikir çıkarabiliriz dostum.`,
            `Kesinlikle haklılık payın var, bu duruma bir de bu gözle bakmamıştım.`,
            `Neden olmasın? İstiyorsan bunun üzerine detaylıca eğilebiliriz.`
        ];
        reply = answers[Math.floor(Math.random() * answers.length)];
    }

    res.json({ reply: reply });
});

app.listen(PORT, () => {
    console.log(`DENİZ 2.0 AKTİF! Port: ${PORT}`);
});
