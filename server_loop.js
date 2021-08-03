const express = require('express');
const VoiceResponse = require('twilio').twiml.VoiceResponse;
const urlencoded = require('body-parser').urlencoded;

const app = express()
app.use(urlencoded({ extended: false }));
const port = 1337


app.post('/voice', (request, response) => {
    // Use the Twilio Node.js SDK to build an XML response
    const twiml = new VoiceResponse();
  
    const gather = twiml.gather({
      input: 'speech',
      language: 'es-UY',
      speechTimeout: 'auto',
      action: '/command',
      method:"POST"
    });
  
    gather.say({
      voice: 'Polly.Miguel',
    }, 'Bienvenido mi amigo, cómo puedo ayudarte?');
    
    response.type('text/xml');
    response.send(twiml.toString());
    });
  

app.post('/command', (request, response) => {
    // Use the Twilio Node.js SDK to build an XML response
    const twiml = new VoiceResponse();
    var message = request.body.SpeechResult

    twiml.say({
        voice: 'Polly.Conchita'
    },request.body.SpeechResult);
    // Render the response as XML in reply to the webhook request

    twiml.redirect({method:'POST'}, '/voice')

    response.type('text/xml');
    response.send(twiml.toString());
});


app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
  })