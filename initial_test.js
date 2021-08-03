const http = require('http');
const VoiceResponse = require('twilio').twiml.VoiceResponse;
const { accountSid, authToken } = require('./config')

http.createServer((req, res) => {
    // Create TwiML response
    const twiml = new VoiceResponse();

    twiml.say({voice:'Polly.Conchita'},
        'Hola estimados, esta es una prueba de agenda médica');

    res.writeHead(200, { 'Content-Type': 'text/xml' });
    res.end(twiml.toString());
  })
  .listen(1337, '127.0.0.1');

console.log('TwiML server running at http://127.0.0.1:1337/');
