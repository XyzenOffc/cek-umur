const crypto = require("crypto");
const fetch = require("node-fetch");

let counter = 0;
let isSpamming = false; // Variabel untuk mengontrol status spam

// Fungsi untuk mengirim pesan secara berulang
const sendMessage = async (username, message) => {
    isSpamming = true; // Mengatur status spam menjadi aktif
    counter = 0; // Reset hitungan pesan

    while (isSpamming) {
        try {
            const date = new Date();
            const minutes = date.getMinutes().toString().padStart(2, "0");
            const hours = date.getHours().toString().padStart(2, "0");
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
                console.log(`[${formattedDate}] [Err] Ratelimited, menunggu 5 detik...`);
                await new Promise(resolve => setTimeout(resolve, 5000));
            } else {
                counter++;
                console.log(`[${formattedDate}] [Msg] Pesan terkirim: ${counter}`);
            }

            // Jeda beberapa detik sebelum mengirim pesan berikutnya
            await new Promise(resolve => setTimeout(resolve, 2000));
        } catch (error) {
            console.error(`[${formattedDate}] [Err] Kesalahan: ${error}`);
            await new Promise(resolve => setTimeout(resolve, 2000)); // Jeda sebelum mencoba lagi
        }
    }
};

// Fungsi untuk menghentikan proses spam
const stopSpam = () => {
    isSpamming = false;
    console.log("Proses spam dihentikan.");
};

// Fungsi untuk memulai proses spam dari terminal
const startSpamFromCLI = () => {
    const readline = require("readline");
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    rl.question('Masukkan username: ', (username) => {
        rl.question('Masukkan pesan: ', (message) => {
            sendMessage(username, message);
            rl.close();
        });
    });
};

// Ekspor fungsi jika ingin diakses dari berkas lain (misalnya HTML)
module.exports = { sendMessage, stopSpam, startSpamFromCLI };
