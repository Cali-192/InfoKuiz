// --- 1. VARIABLAT DHE PROGRESI ---
let progress = JSON.parse(localStorage.getItem("ensar_academy_progress")) || {};
let totalDiamonds = parseInt(localStorage.getItem("ensar_total_diamonds")) || 0;
let isVip = localStorage.getItem("ensar_is_vip") === "true";

// DATABASE - Tematikat e kurseve
const tematikat = {
    1: { t: "HTML5 Master", i: "📑", d: "Struktura Web" },
    2: { t: "CSS3 Design", i: "🎨", d: "Stilizimi" },
    3: { t: "JavaScript Pro", i: "⚡", d: "Logjika" },
    4: { t: "Python Core", i: "🐍", d: "Data Science" },
    5: { t: "Java Backend", i: "☕", d: "Enterprise" },
    6: { t: "C++ Advanced", i: "👾", d: "Sistemet" },
    7: { t: "PHP Server Side", i: "🐘", d: "Web Apps" },
    8: { t: "SQL Databases", i: "💾", d: "Të dhënat" },
    9: { t: "React.js", i: "⚛️", d: "Frontend Lib" },
    10: { t: "Node.js", i: "🟢", d: "Backend JS" },
    11: { t: "Cyber Security", i: "🛡️", d: "Mbrojtja" },
    12: { t: "AI & ML", i: "🤖", d: "Inteligjenca" },
    13: { t: "Networking", i: "🌐", d: "Rrjetat" },
    14: { t: "Cloud Computing", i: "☁️", d: "AWS/Azure" },
    15: { t: "Data Science", i: "📊", d: "Analitika" },
    16: { t: "Swift iOS", i: "🍎", d: "iPhone Apps" },
    17: { t: "Kotlin Android", i: "📱", d: "Android Apps" },
    18: { t: "Unity Game Dev", i: "🎮", d: "Lojërat" },
    19: { t: "Linux OS", i: "🐧", d: "Terminali" },
    20: { t: "Git & GitHub", i: "📂", d: "Versionet" },
    21: { t: "Blockchain", i: "⛓️", d: "Crypto" },
    22: { t: "Excel Pro", i: "📈", d: "Biznes" },
    23: { t: "Hardware Build", i: "🔌", d: "Pajisjet" },
    24: { t: "Digital Marketing", i: "📣", d: "Social Media" },
    25: { t: "UI/UX Design", i: "✒️", d: "Dizajni" },
    26: { t: "Algorithms", i: "🧩", d: "Zgjidhja" },
    27: { t: "IoT Tech", i: "🏠", d: "Smart Home" },
    28: { t: "Machine Learning", i: "🧠", d: "Mësimi" },
    29: { t: "Docker & DevOps", i: "🐳", d: "Automatizimi" },
    30: { t: "Final Tech Exam", i: "🎓", d: "Testi Final" }
};

const kurset = {};
Object.keys(tematikat).forEach(id => {
    kurset[id] = {
        titulli: tematikat[id].t,
        ikona: tematikat[id].i,
        pyetje: generateQuestions(tematikat[id].t, 25)
    };
});

function generateQuestions(emri, sa) {
    let p = [];
    const konceptet = ["Sintaksa", "Struktura", "Siguria", "Efikasiteti", "Lidhja", "Memorja", "Performanca", "Standardi"];
    for(let i=1; i<=sa; i++) {
        p.push({
            q: `Pyetja ${i}: Cili është koncepti kryesor i ${emri} kur flasim për ${konceptet[i % konceptet.length]}?`,
            a: [`Përdorimi i ${emri} Pro`, `Optimizimi i kodit`, `Standardi i ri 2024`],
            s: Math.floor(Math.random() * 3)
        });
    }
    return p;
}

// VARIABLAT E LOJES
let activeK = null; let idx = 0; let score = 0; let kID = null;
let lives = 3; let streak = 0;
let timerInterval = null; let timeLeft = 15;

// --- 2. FUNKSIONET E DYQANIT (SHOP) ---
function openShop() {
    const shopModal = document.getElementById("shop-modal");
    if(shopModal) {
        document.getElementById("shop-balance").innerText = totalDiamonds;
        shopModal.classList.remove("d-none");
        shopModal.classList.add("d-flex");
    }
}

function closeShop() {
    const shopModal = document.getElementById("shop-modal");
    if(shopModal) {
        shopModal.classList.add("d-none");
        shopModal.classList.remove("d-flex");
    }
}

function buyItem(type, price) {
    if (totalDiamonds < price) {
        shfaqToast("Nuk keni mjaftueshëm diamante! ❌", "warning");
        return;
    }
    totalDiamonds -= price;
    localStorage.setItem("ensar_total_diamonds", totalDiamonds);
    
    // Update UI
    const balanceEl = document.getElementById("shop-balance");
    if(balanceEl) balanceEl.innerText = totalDiamonds;
    const totalPointsEl = document.getElementById("total-points");
    if(totalPointsEl) totalPointsEl.innerText = totalDiamonds;

    if (type === 'life') {
        lives++;
        if(document.getElementById("lives-val")) document.getElementById("lives-val").innerText = lives;
        shfaqToast("Blerja u krye! +1 Jetë ❤️", "success");
    } else if (type === 'vip') {
        isVip = true;
        localStorage.setItem("ensar_is_vip", "true");
        shfaqToast("URIME! Tani je anëtar VIP Gold! ✨", "success");
        displayLeaderboard();
    }
    updateRank();
}

// --- 3. LOGJIKA E RANGUT DHE LEADERBOARD ---
function updateRank() {
    let kurseTeKryera = Object.keys(progress).length;
    let totalPoints = totalDiamonds; // Përdorim diamantet si matës suksesi
    
    if(document.getElementById("total-points")) {
        document.getElementById("total-points").innerText = totalDiamonds;
    }

    let rankTitle = "Fillestar", rankIcon = "🐣", nextRankPoints = 500;
    
    if (totalPoints >= 5000) { rankTitle = "Master i Teknologjisë"; rankIcon = "👑"; nextRankPoints = 5000; }
    else if (totalPoints >= 2000) { rankTitle = "Ekspert Digjital"; rankIcon = "🚀"; nextRankPoints = 5000; }
    else if (totalPoints >= 500) { rankTitle = "Programer i Rinisë"; rankIcon = "👨‍💻"; nextRankPoints = 2000; }

    const rTitleEl = document.getElementById("rank-title");
    const rIconEl = document.getElementById("rank-icon");
    if(rTitleEl) rTitleEl.innerText = rankTitle;
    if(rIconEl) rIconEl.innerText = rankIcon;

    const xpBar = document.getElementById("xp-bar");
    if(xpBar) {
        let currentRankMin = (totalPoints >= 2000) ? 2000 : (totalPoints >= 500) ? 500 : 0;
        let progressXp = ((totalPoints - currentRankMin) / (nextRankPoints - currentRankMin)) * 100;
        xpBar.style.width = (totalPoints >= 5000 ? 100 : Math.max(5, progressXp)) + "%";
    }
}

function displayLeaderboard() {
    const listCont = document.getElementById("leaderboard-list");
    if(!listCont) return;
    
    let leaderboard = JSON.parse(localStorage.getItem("infokuiz_leaderboard")) || [];
    
    if (leaderboard.length === 0) {
        listCont.innerHTML = `
            <div class="text-center py-4 animate__animated animate__fadeIn">
                <div class="fs-1 mb-2">🏆</div>
                <p class="text-muted small">Ende nuk ka liderë në listë.<br>Përfundo një kurs dhe <strong>bëhu i pari!</strong></p>
            </div>`;
        return;
    }
    
    listCont.innerHTML = leaderboard.map((user, index) => {
        let medal = index === 0 ? "🥇" : (index === 1 ? "🥈" : (index === 2 ? "🥉" : "👤"));
        let nameStyle = user.vip ? 'style="color: #ffc107; font-weight: bold; text-shadow: 0 0 5px rgba(255,193,7,0.5)"' : '';
        return `<div class="d-flex align-items-center justify-content-between p-3 mb-2 bg-white rounded-4 border animate__animated animate__fadeInLeft" style="animation-delay: ${index * 0.1}s">
                <div class="d-flex align-items-center">
                    <span class="me-3 fs-4">${medal}</span>
                    <span class="fw-bold text-dark" ${nameStyle}>${user.emri}${user.vip ? ' ⭐' : ''}</span>
                </div>
                <span class="badge bg-primary-subtle text-primary rounded-pill px-3 py-2 fw-bold">${user.piket} 💎</span>
            </div>`;
    }).join("");
}

// --- 4. KONTROLLI I LOJES ---
function renderLobby() {
    updateRank();
    showQuote();
    displayLeaderboard();
    const cont = document.getElementById("nivelet-container");
    if(!cont) return;
    cont.innerHTML = "";
    Object.keys(kurset).forEach(id => {
        const k = kurset[id];
        const isDone = progress[id];
        const doneTag = isDone ? '<span class="completed-badge">✓ E KRYER</span>' : '';
        // SHTUAR: Klasa "course-card-wrapper" që kërkimi ta gjejë këtë div
        cont.innerHTML += `<div class="col-lg-3 col-md-4 col-6 animate__animated animate__fadeInUp course-card-wrapper">
                <div class="level-box" onclick="startKurs(${id})">
                    ${doneTag}
                    <div class="fs-1 mb-2">${k.ikona}</div>
                    <h6 class="fw-bold mb-1 small text-truncate">${k.titulli}</h6>
                </div>
            </div>`;
    });
}

function startKurs(id) {
    kID = id; activeK = kurset[id]; idx = 0; score = 0; lives = 3; streak = 0;
    
    // Reset UI
    document.getElementById("lives-val").innerText = lives;
    document.getElementById("score-val").innerText = score;
    document.getElementById("lobby-screen").classList.add("d-none");
    document.getElementById("hero").classList.add("d-none");
    document.getElementById("quiz-screen").classList.remove("d-none");
    
    // Scroll to top for mobile
    window.scrollTo(0,0);
    loadQ();
}

function quitQuiz() {
    if(confirm("A jeni i sigurt që dëshironi të dilni? Progresi i këtij raundi do të humbasë.")) {
        clearInterval(timerInterval);
        document.getElementById("quiz-screen").classList.add("d-none");
        document.getElementById("lobby-screen").classList.remove("d-none");
        document.getElementById("hero").classList.remove("d-none");
        renderLobby();
    }
}

function loadQ() {
    clearInterval(timerInterval);
    const q = activeK.pyetje[idx];
    
    document.getElementById("q-count").innerText = `Misioni ${idx+1}/25`;
    document.getElementById("question-text").innerText = q.q;
    
    const optCont = document.getElementById("options-container");
    optCont.innerHTML = "";
    
    q.a.forEach((o, i) => {
        const b = document.createElement("button");
        b.className = "option-btn animate__animated animate__fadeInUp";
        b.style.animationDelay = `${i * 0.1}s`;
        b.innerText = o; 
        b.onclick = () => check(i, b);
        optCont.appendChild(b);
    });

    document.getElementById("progress-bar").style.width = ((idx) / 25) * 100 + "%";

    const timerCont = document.getElementById("timer-container");
    if (idx >= 19) {
        timerCont.style.display = "block";
        startTimer();
    } else {
        timerCont.style.display = "none";
    }
}

function startTimer() {
    timeLeft = 15;
    const timerLine = document.getElementById("timer-line");
    timerLine.style.width = "100%";
    timerLine.classList.remove("timer-low");

    timerInterval = setInterval(() => {
        timeLeft--;
        let per = (timeLeft / 15) * 100;
        timerLine.style.width = per + "%";
        
        if(timeLeft <= 5) timerLine.classList.add("timer-low");

        if (timeLeft <= 0) { 
            clearInterval(timerInterval); 
            handleTimeout(); 
        }
    }, 1000);
}

function handleTimeout() {
    lives--;
    document.getElementById("lives-val").innerText = lives;
    shfaqToast("KOHA MBAROI! -1 ❤️", "warning");
    
    if (lives <= 0) {
        gameOver();
    } else {
        idx++;
        if(idx < 25) loadQ(); else finish();
    }
}

function check(i, b) {
    clearInterval(timerInterval);
    const sakt = activeK.pyetje[idx].s;
    const bar = document.getElementById("feedback-bar");
    const btns = document.querySelectorAll(".option-btn");

    btns.forEach(btn => btn.style.pointerEvents = "none");
    bar.classList.remove("d-none", "bg-correct", "bg-wrong");
    
    if(i === sakt) { 
        let pointsToAdd = (idx >= 19) ? 20 : 10;
        score += pointsToAdd; 
        streak++;
        bar.classList.add("bg-correct"); 
        document.getElementById("feedback-message").innerHTML = `<b>Saktë!</b> +${pointsToAdd} 💎`; 
        document.getElementById("score-val").innerText = score;
        
        if(streak === 5) {
            lives++; 
            document.getElementById("lives-val").innerText = lives;
            shfaqToast("STREAK 5! Bonus +1 Jetë ❤️", "success");
        }
    } else { 
        streak = 0; 
        lives--; 
        document.getElementById("lives-val").innerText = lives;
        b.style.borderColor = "#ff4b4b";
        bar.classList.add("bg-wrong"); 
        document.getElementById("feedback-message").innerHTML = `<b>Gabim!</b> Përgjigja ishte: ${activeK.pyetje[idx].a[sakt]}`;
        
        if(lives <= 0) {
            gameOver();
            return;
        }
    }

    document.getElementById("next-btn").onclick = () => {
        bar.classList.add("d-none"); 
        idx++;
        if(idx < 25) loadQ(); else finish();
    };
}

function gameOver() {
    const bar = document.getElementById("feedback-bar");
    bar.classList.remove("d-none", "bg-correct");
    bar.classList.add("bg-wrong");
    document.getElementById("feedback-message").innerHTML = "Misioni Dështoi! Nuk keni më jetë.";
    document.getElementById("next-btn").innerText = "KTHEHU NË LOBBY";
    document.getElementById("next-btn").onclick = () => location.reload();
}

// --- 5. SERTIFIKIMI DHE FUNDI ---
function finish() {
    clearInterval(timerInterval);
    progress[kID] = true; 
    localStorage.setItem("ensar_academy_progress", JSON.stringify(progress));
    
    totalDiamonds += score;
    localStorage.setItem("ensar_total_diamonds", totalDiamonds);

    fireConfetti();
    document.getElementById("quiz-screen").classList.add("d-none");
    
    let emri = prompt("Urime! Shkruaj emrin tënd për sertifikatë:", localStorage.getItem("ensar_user_name") || "Student");
    if (!emri) emri = "Student";

    localStorage.setItem("ensar_user_name", emri);
    updateLeaderboard(emri, totalDiamonds);

    document.getElementById("cert-user-name").innerText = emri;
    document.getElementById("cert-course-name").innerText = activeK.titulli;
    document.getElementById("cert-date").innerText = new Date().toLocaleDateString('sq-AL');
    
    document.getElementById("cert-modal").classList.remove("d-none");
    document.getElementById("cert-modal").classList.add("d-flex");
}

function updateLeaderboard(emri, piket) {
    let leaderboard = JSON.parse(localStorage.getItem("infokuiz_leaderboard")) || [];
    // Kontrollo nëse përdoruesi ekziston dhe përditëso pikët e tij
    let userIdx = leaderboard.findIndex(u => u.emri === emri);
    if(userIdx !== -1) {
        leaderboard[userIdx].piket = piket;
        leaderboard[userIdx].vip = isVip;
    } else {
        leaderboard.push({ emri: emri, piket: piket, vip: isVip });
    }
    
    leaderboard.sort((a, b) => b.piket - a.piket);
    localStorage.setItem("infokuiz_leaderboard", JSON.stringify(leaderboard.slice(0, 5)));
    displayLeaderboard();
}

function closeCert() {
    document.getElementById("cert-modal").classList.add("d-none");
    document.getElementById("cert-modal").classList.remove("d-flex");
    location.reload(); // Rifreskojmë që të shohim progresin e ri
}

function downloadCert(format) {
    const originalCert = document.getElementById("cert-to-print");
    if(!originalCert) return;

    shfaqToast("Duke përgatitur dokumentin...", "info");

    html2canvas(originalCert, { 
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff"
    }).then(canvas => {
        const imgData = canvas.toDataURL("image/png");
        if (format === 'png') {
            const link = document.createElement("a");
            link.download = `Sertifikata_${activeK ? activeK.titulli : 'Kursi'}.png`;
            link.href = imgData; 
            link.click();
        } else {
            const { jsPDF } = window.jspdf;
            const pdf = new jsPDF('l', 'mm', 'a4');
            pdf.addImage(imgData, 'PNG', 0, 0, 297, 210);
            pdf.save(`Sertifikata_${activeK ? activeK.titulli : 'Kursi'}.pdf`);
        }
    }).catch(err => {
        console.error(err);
        shfaqToast("Gabim gjatë shkarkimit!", "warning");
    });
}

// --- 6. DARK MODE DHE INICIALIZIMI ---
const themeToggle = document.getElementById('theme-toggle');
if (themeToggle) {
    if (localStorage.getItem('theme') === 'dark') {
        document.body.classList.add('dark-mode');
        themeToggle.innerText = "☀️";
    }
    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        const isDark = document.body.classList.contains('dark-mode');
        themeToggle.innerText = isDark ? "☀️" : "🌙";
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
    });
}

function shfaqToast(mesazhi, tipi = "info") {
    const container = document.getElementById("toast-container");
    if(!container) return; 
    const toast = document.createElement("div");
    toast.className = `toast-msg ${tipi}`;
    toast.innerHTML = `<span>${mesazhi}</span>`;
    container.appendChild(toast);
    
    // Auto-remove
    setTimeout(() => {
        toast.style.animation = "slideOut 0.5s ease forwards";
        setTimeout(() => toast.remove(), 500);
    }, 3000);
}

function showQuote() {
    const quotes = [
        "Kodi më i mirë është ai që nuk ekziston.",
        "Programimi është zgjidhje problemesh, jo shkrim kodi.",
        "Gjithçka fillon me një 'Hello World'.",
        "Mëso çdo ditë sikur do të jetosh përgjithmonë."
    ];
    const qEl = document.getElementById("daily-quote");
    if(qEl) qEl.innerText = `"${quotes[Math.floor(Math.random() * quotes.length)]}"`;
}

function fireConfetti() {
    if(typeof confetti === 'function') {
        confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
    }
}

// Inicializimi
window.addEventListener('DOMContentLoaded', () => {
    renderLobby();
    
    // SHTUAR: Funksioni i kërkimit (Search)
    const searchInput = document.getElementById('courseSearch');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const term = e.target.value.toLowerCase();
            const cards = document.querySelectorAll('.course-card-wrapper');
            
            cards.forEach(card => {
                const titulli = card.querySelector('h6').innerText.toLowerCase();
                if (titulli.includes(term)) {
                    card.style.display = "block";
                } else {
                    card.style.display = "none";
                }
            });
        });
    }

    setTimeout(() => {
        shfaqToast("Mirëseerdhe në Info Kuiz! 🎓", "info");
    }, 1000);
});
window.addEventListener('beforeinstallprompt', (e) => {
    // Parandalon shfaqjen automatike të Chrome
    e.preventDefault();
    let deferredPrompt = e;
    
    // Shfaq njoftimin tonë pas 5 sekondave
    setTimeout(() => {
        shfaqToast("Instalo Info Kuiz për qasje më të shpejtë! 📱", "info");
    }, 5000);
});