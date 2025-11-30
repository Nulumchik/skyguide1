/*
 Simple Node + Express + Socket.io server for SkyGuide (no registration).
 Persists messages to messages.json (append).
*/
const express = require('express');
const http = require('http');
const path = require('path');
const fs = require('fs');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

const PORT = process.env.PORT || 3000;
const PUBLIC = path.join(__dirname, 'public');
app.use(express.static(PUBLIC));

const MSG_FILE = path.join(__dirname, 'messages.json');
if (!fs.existsSync(MSG_FILE)) fs.writeFileSync(MSG_FILE, JSON.stringify([]));

function readMessages(){
  try{ return JSON.parse(fs.readFileSync(MSG_FILE)); }
  catch(e){ return []; }
}
function saveMessage(m){
  const a = readMessages();
  a.push(m);
  fs.writeFileSync(MSG_FILE, JSON.stringify(a, null, 2));
}

// REST: recent messages
app.get('/api/messages', (req, res) => {
  res.json(readMessages());
});

// Socket.io
io.on('connection', socket => {
  console.log('connect', socket.id);
  // send history
  socket.emit('chat history', readMessages().slice(-500));
  socket.on('chat message', msg => {
    msg.ts = msg.ts || Date.now();
    saveMessage(msg);
    io.emit('chat message', msg);
  });
  socket.on('disconnect', ()=>{ console.log('disconnect', socket.id); });
});

app.get('*', (req, res) => {
  res.sendFile(path.join(PUBLIC, 'index.html'));
});

server.listen(PORT, ()=> console.log('SkyGuide server running on http://localhost:' + PORT));