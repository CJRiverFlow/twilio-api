const express = require('express');
const VoiceResponse = require('twilio').twiml.VoiceResponse;
const urlencoded = require('body-parser').urlencoded;

const app = express()
app.use(urlencoded({ extended: false }));
const port = 1337

/*
Working with npm package
*/
app.post('/voice_test', (request, response) => {
    // Using twilio library
    const twiml = new VoiceResponse();
    
    const gather = twiml.gather({
      input: 'speech',
      language: 'es-UY',
      speechTimeout: 'auto',
      action: '/command_test',
      method:"POST"
    });
  
    gather.say({
      voice: 'Polly.Conchita',
    }, 'Bienvenido mi amigo, cómo puedo ayudarte?')

    var response_message=twiml.toString()
    console.log(response_message)
    
    response.type('text/xml');
    response.send(response_message);
    });
    

app.post('/command_test', (request, response) => {
    // Use the Twilio Node.js SDK to build an XML response
    const twiml = new VoiceResponse();
    var message = request.body.SpeechResult

    twiml.say({
        voice: 'Polly.Conchita'
    },request.body.SpeechResult);

    twiml.redirect({method:'POST'}, '/voice_test')

    response.type('text/xml');
    response.send(twiml.toString());
});


/*
Using twiML string directly
This could work better if we predesignthe message.
CURRENTLY USING THIS ON WEBHOOK
*/
app.post('/voice', (request,response) =>{
    console.log(`Incomming call`)
    response.type('text/xml');
    response.send(`
    <Response>
        <Gather action="/command" input='speech' language='es-UY' speechTimeout='auto'>
            <Say voice='Polly.Lupe-Neural'>
                <prosody rate="medium">
                    Bienvenido mi amigo, cómo puedo ayudarte?
                </prosody>
            </Say>
        </Gather>
    </Response>
    `);
});


app.post('/command', (request,response) =>{
    var message = request.body.SpeechResult

    response.type('text/xml');
    response.send(`
    <Response>
            <Say voice='Polly.Lupe-Neural'>
                <prosody rate="medium">
                    Has dicho: ${message}
                </prosody>
            </Say>
            <Redirect method='POST'>/voice</Redirect>
    </Response>
    `);
});



app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
  })