const express = require('express');
const VoiceResponse = require('twilio').twiml.VoiceResponse;
const urlencoded = require('body-parser').urlencoded; //needed to work with Twilio and avoid empty messages

const app = express()
app.use(urlencoded({ extended: false }));
const port = 1337

/*
Using twiML string directly
This could work better if we predesign the message.
CURRENTLY USING THIS ON WEBHOOK APP
*/
app.post('/voice', (request,response) =>{
    //Just to execute the WELCOME intent message
    console.log(`Inbound call`)
    response.type('text/xml');
    response.send(`
    <Response>
        <Gather action="/loop" input='speech' language='es-UY' speechTimeout='auto'>
            <Say voice='Polly.Mia'>
                <prosody rate="medium">
                    Bienvenido a agenda médica, puedo ayudarte a agendar o modificar tus citas. 
                    Qué desea realizar?
                </prosody>
            </Say>
        </Gather>
    </Response>
    `);
});


app.post('/loop', (request,response) =>{
    /*
    Loop process to speak-listen continouos flow.
    */
    var message = request.body.SpeechResult
    console.log(message)
    response.type('text/xml');
    response.send(`
    <Response>
        <Gather action="/loop" input='speech' language='es-UY' speechTimeout='auto'>
            <Say voice='Polly.Lupe-Neural'>
                <prosody rate="medium">
                    Tu mensaje fue: ${message}
                </prosody>
            </Say>
        </Gather>
    </Response>
    `);
});

app.listen(port, () => {
    console.log(`Twilio app listening at http://localhost:${port}`)
  })