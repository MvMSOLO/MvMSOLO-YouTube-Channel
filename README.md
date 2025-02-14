<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>MvMSOLO - Official Site</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background: linear-gradient(45deg, #141e30, #243b55);
            color: white;
            text-align: center;
            margin: 0;
            padding: 0;
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
        #subscribers {
            font-size: 24px;
            font-weight: bold;
            margin-top: 10px;
        }
    </style>
</head>
<body>

    <h1>🎮 Welcome to MvMSOLO Official Site 🎮</h1>
    
    <div class="container">
        <h2>🔥 My Most Popular Video</h2>
        <iframe width="560" height="315" src="https://www.youtube.com/embed/yvuDhCpcJeA" frameborder="0" allowfullscreen></iframe>

        <h2>📢 My Goal: 1 Million Subscribers</h2>
        <p>Subscribe to my channel and help me reach my dream! 🎯</p>
        <p>Current Subscribers:</p>
        <div id="subscribers">Loading...</div>

        <h2>🎬 Editing Software I Use</h2>
        <p>CapCut, Wink, Adobe Premiere Pro, After Effects</p>

        <h2>⚽ Favorite Player</h2>
        <p><strong>Cristiano Ronaldo</strong> - The GOAT 🐐</p>

        <h2>🎁 Win Prizes!</h2>
        <p>Subscribe to my YouTube channel and participate in giveaways!</p>
        <button class="btn" onclick="window.location.href='https://www.youtube.com/@MvMSOLO'">Subscribe Now</button>
    </div>

    <script>
        async function getSubscribers() {
            const API_KEY = "AIzaSyAMItX7n3RChN1Tv-GvtnDU497Wd7hLtbc";
            const CHANNEL_ID = "UCFrmniXG_EnNC8006SV8UhQ";
            const url = `https://www.googleapis.com/youtube/v3/channels?part=statistics&id=${CHANNEL_ID}&key=${API_KEY}`;

            try {
                let response = await fetch(url);
                let data = await response.json();
                let subCount = data.items[0].statistics.subscriberCount;
                document.getElementById("subscribers").innerText = subCount + " Subscribers";
            } catch (error) {
                console.error("Error fetching subscribers:", error);
                document.getElementById("subscribers").innerText = "Failed to load";
            }
        }
        getSubscribers();
    </script>

</body>
</html>
