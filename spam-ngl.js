const crypto = require("crypto");
const fetch = require("node-fetch");

let counter = 0;
let spamming = false;

const sendMessage = async (username, message) => {
    while (spamming) {
        try {
            const date = new Date();
            const minutes = date.getMinutes();
            const hours = date.getHours();
            const formattedDate = `${hours}:${minutes}`;

            const deviceId = crypto.randomBytes(21).toString("hex");
            const url = "https://ngl.link/api/submit";
            const headers = {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/109.0",
                "Accept": "*/*",
                "Accept-Language": "en-US,en;q=0.5",
                "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
                "X-Requested-With": "XMLHttpRequest",
                "Sec-Fetch-Dest": "empty",
                "Sec-Fetch-Mode": "cors",
                "Sec-Fetch-Site": "same-origin",
                "Referer": `https://ngl.link/${username}`,
                "Origin": "https://ngl.link"
            };
            const body = `username=${username}&question=${message}&deviceId=${deviceId}&gameSlug=&referrer=`;

            const response = await fetch(url, {
                method: "POST",
                headers,
                body,
                mode: "cors",
                credentials: "include"
            });

            if (response.status !== 200) {
                console.log(`[${formattedDate}] [Err] Ratelimited, waiting 5 seconds...`);
                await new Promise(resolve => setTimeout(resolve, 5000)); // Tunggu sebelum mencoba lagi
            } else {
                counter++;
                console.log(`[${formattedDate}] [Msg] Sent: ${counter}`);
                document.getElementById('status').innerText = `Pesan terkirim: ${counter}`;
            }

            // Tunggu beberapa detik sebelum mengirim pesan berikutnya
            await new Promise(resolve => setTimeout(resolve, 2000)); // Tunggu 2 detik
        } catch (error) {
            console.error(`[${formattedDate}] [Err] ${error}`);
            await new Promise(resolve => setTimeout(resolve, 2000)); // Tunggu sebelum mencoba lagi
        }
    }
};

function startSpamming() {
    const username = document.getElementById('username').value;
    const message = document.getElementById('message').value;

    if (!username || !message) {
        alert("Tolong masukkan username dan pesan!");
        return;
    }

    spamming = true;
    counter = 0;
    document.getElementById('status').innerText = "Mulai mengirim...";

    sendMessage(username, message);
}

// Tambahan untuk menghentikan spam jika diperlukan
document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === 'hidden') {
        spamming = false;
    } else {
        spamming = true;
    }
});
