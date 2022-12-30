'use strict';

const express = require('express');
const path = require('path');
const { createServer } = require('http');

const WebSocket = require('ws');

app.post('/api/data', (req, res) => {
  const data = req.body; // request body is parsed as JSON by default

  // validate the data
  if (data.key !== 'value') {
    return res.status(400).send({error: 'Invalid data'});
  }

  // store the data in a database
  db.save(data);

  res.send({success: true});
});

const app = express();
app.use(express.static(path.join(__dirname, '/public')));

const server = createServer(app);
const wss = new WebSocket.Server({ server });

wss.on('connection', function (ws) {
  ws.send("connected to WSS");
  wss.clients.add(ws);
  //console.log(wss.clients.length);
  console.log('started client interval');

  ws.on('message', function incoming(message) {
    console.log('received: %s', message);
    ws.send();

    wss.clients.forEach(function each(client) {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(message.toString());
      }
      
    });
  });

  

  ws.on('close', function () {
    console.log('stopping client interval');
  });
});

server.listen(8080, function () {
  console.log('Listening on http://0.0.0.0:8080');
});

