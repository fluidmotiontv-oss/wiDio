const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const path = require('path');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

app.use(express.static(path.join(__dirname)));
app.use(express.json());

// Store current playing track state
let currentTrack = {
  title: "Cybernetic Pulse",
  artist: "Aether Wave ft. Synthia",
  albumArt: "https://picsum.photos/200",
  genre: "electronic"
};

// WebSocket Broadcast to all connected WebGL screens
function broadcastTrackUpdate() {
  const payload = JSON.stringify(currentTrack);
  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(payload);
    }
  });
}

wss.on('connection', (ws) => {
  // Send current track immediately on connect
  ws.send(JSON.stringify(currentTrack));
});

// HTTP API Endpoint for Radio Automation (AzuraCast / RadioBOSS / PlayIt Live webhook)
app.post('/api/nowplaying', (req, res) => {
  const { title, artist, albumArt, genre } = req.body;
  if (title) currentTrack.title = title;
  if (artist) currentTrack.artist = artist;
  if (albumArt) currentTrack.albumArt = albumArt;
  if (genre) currentTrack.genre = genre;

  broadcastTrackUpdate();
  res.json({ status: "success", currentTrack });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`[Radio Visualizer Server] Running on http://localhost:${PORT}`);
  console.log(`[API Endpoint] Send track updates to POST http://localhost:${PORT}/api/nowplaying`);
});
