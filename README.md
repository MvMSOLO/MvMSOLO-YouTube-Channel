<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>MvMSOLO - Official AI Site</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background: linear-gradient(45deg, #0f0c29, #302b63, #24243e);
            color: white;
            text-align: center;
            margin: 0;
            padding: 0;
            transition: background 0.5s;
        }
        .container {
            max-width: 900px;
            margin: 20px auto;
            padding: 20px;
            background-color: rgba(0, 0, 0, 0.7);
            border-radius: 10px;
        }
        .btn {
            background-color: #ff0000;
            padding: 10px;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-size: 18px;
            margin-top: 10px;
        }
        #subscribers, #liveViews, #channelViews, #videoCount, #popularVideo {
            font-size: 24px;
            font-weight: bold;
            margin-top: 10px;
        }
    </style>
</head>
<body>

<h1>🎮 Welcome to MvMSOLO Official AI Site 🎮</h1>

<div class="container">
    <h2>📢 My Goal: 1 Million Subscribers</h2>
    <p>Subscribe to my channel and help me reach my dream! 🎯</p>
    <p>Current Subscribers:</p>
    <div id="subscribers">Loading...</div>
    <p>Live Viewers:</p>
    <div id="liveViews">Loading...</div>
    <p>Total Channel Views:</p>
    <div id="channelViews">Loading...</div>
    <p>Total Videos:</p>
    <div id="videoCount">Loading...</div>
    <p>Most Popular Video:</p>
    <div id="popularVideo">Loading...</div>

    <button class="btn" onclick="window.location.href='https://www.youtube.com/@MvMSOLO'">Subscribe Now</button>
</div>

<div class="container">
    <h2>🎬 Latest Live Stream</h2>
    <div id="liveVideo">Loading...</div>
</div>

<script>
    const API_KEY = "AIzaSyAMItX7n3RChN1Tv-GvtnDU497Wd7hLtbc";
    const CHANNEL_ID = "UCFrmniXG_EnNC8006SV8UhQ";

    async function getSubscribers() {
        const url = `https://www.googleapis.com/youtube/v3/channels?part=statistics&id=${UCFrmniXG_EnNC8006SV8UhQ}&key=${AIzaSyAMItX7n3RChN1Tv-GvtnDU497Wd7hLtbc}`;
        try {
            let response = await fetch(url);
            let data = await response.json();
            document.getElementById("subscribers").innerText = data.items[0].statistics.subscriberCount + " Subscribers";
            document.getElementById("channelViews").innerText = data.items[0].statistics.viewCount + " Views";
            document.getElementById("videoCount").innerText = data.items[0].statistics.videoCount + " Videos";
        } catch (error) {
            document.getElementById("subscribers").innerText = "Failed to load";
        }
    }

    async function getLatestLiveStream() {
        const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${UCFrmniXG_EnNC8006SV8UhQ}&type=video&eventType=live&maxResults=1&key=${AIzaSyAMItX7n3RChN1Tv-GvtnDU497Wd7hLtbc}`;
        try {
            let response = await fetch(url);
            let data = await response.json();
            if (data.items.length > 0) {
                let videoId = data.items[0].id.videoId;
                document.getElementById("liveVideo").innerHTML = `<iframe width="560" height="315" src="https://www.youtube.com/embed/${videoId}" frameborder="0" allowfullscreen></iframe>`;
                getLiveViews(videoId);
            } else {
                document.getElementById("liveVideo").innerText = "No live stream currently.";
                document.getElementById("liveViews").innerText = "N/A";
            }
        } catch (error) {
            document.getElementById("liveVideo").innerText = "Failed to load live stream.";
            document.getElementById("liveViews").innerText = "N/A";
        }
    }

    async function getPopularVideo() {
        const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${UCFrmniXG_EnNC8006SV8UhQ}&order=viewCount&type=video&maxResults=1&key=${AIzaSyAMItX7n3RChN1Tv-GvtnDU497Wd7hLtbc}`;
        try {
            let response = await fetch(url);
            let data = await response.json();
            if (data.items.length > 0) {
                let videoId = data.items[0].id.videoId;
                document.getElementById("popularVideo").innerHTML = `<a href="https://www.youtube.com/watch?v=${videoId}" target="_blank">Watch Most Popular Video</a>`;
            } else {
                document.getElementById("popularVideo").innerText = "No Data";
            }
        } catch (error) {
            document.getElementById("popularVideo").innerText = "Failed to load";
        }
    }

    getSubscribers();
    getLatestLiveStream();
    getPopularVideo();
</script>
<div class="container">
    <h2>🧠 AI ChatBot</h2>
    <p>O‘zingizga yoqqan savolni bering va AI javob beradi!</p>
    <input type="text" id="userInput" placeholder="Savolingizni yozing..." style="width: 80%; padding: 10px;">
    <button class="btn" onclick="askAI()">Yuborish</button>
    <div id="aiResponse" style="margin-top: 10px; font-weight: bold;">Javob: ...</div>
</div>

<div class="container">
    <h2>🕹️ Mini O‘yinlar</h2>
    <p>O‘yin o‘ynashni xohlaysizmi? Quyidagi tugmalardan birini bosing:</p>
    <button class="btn" onclick="startTicTacToe()">Tic-Tac-Toe</button>
    <button class="btn" onclick="startGuessNumber()">Raqam Topish</button>
    <div id="gameResult" style="margin-top: 10px;"></div>
</div>

<div class="container">
    <h2>🌎 Dunyo Vaxtlari</h2>
    <select id="citySelect" onchange="showTime()">
        <option value="Asia/Tashkent">Toshkent</option>
        <option value="Europe/London">London</option>
        <option value="America/New_York">New York</option>
        <option value="Asia/Tokyo">Tokio</option>
    </select>
    <div id="cityTime" style="margin-top: 10px; font-size: 20px; font-weight: bold;">Vaqt: ...</div>
</div>

<div class="container">
    <h2>📈 Valyuta Kurslari</h2>
    <button class="btn" onclick="getExchangeRates()">Yangilash</button>
    <div id="exchangeRates" style="margin-top: 10px;"></div>
</div>

<script>
    function showTime() {
        let city = document.getElementById("citySelect").value;
        let now = new Date().toLocaleString("en-US", { timeZone: city });
        document.getElementById("cityTime").innerText = "Vaqt: " + now;
    }
</script>
</body>
</html>
