const express = require('express');
//const VoiceResponse = require('twilio').twiml.VoiceResponse;
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
    //console.log(request.body) 
    console.log(request.body.CallSid) // Unique call Id
    console.log(request.body.CallStatus) // Call status, changes between ringing, in-progress and completed.
    
    response.type('text/xml');
    response.send(`
    <Response>
        <Say voice='Polly.Lupe-Neural'>
            <prosody rate="90%">
                Bienvenido a agenda médica, puedo ayudarte a agendar o modificar tus citas. 
                Qué desea realizar?
            </prosody>
        </Say>
        <Gather action="/loop" input='speech' language='es-UY' speechTimeout='auto'>
        </Gather>
    </Response>
    `);
});


app.post('/loop', (request,response) =>{
    /*
    Loop process to speak-listen continouos flow.
    */
    console.log(request.body.CallSid)
    console.log(request.body.CallStatus)

    if (typeof request.body.SpeechResult !== 'undefined'){
        var message = request.body.SpeechResult
    }else{
        var message = "No pude escuchar nada, podría repetirlo?"
    }

    console.log(message)
    response.type('text/xml');
    response.send(`
    <Response>
        <Say voice='Polly.Lupe-Neural'>
            <prosody rate="90%">
                ${message}
            </prosody>
        </Say>
        <Gather action="/loop" input='speech' language='es-UY' speechTimeout='auto' actionOnEmptyResult="true">     
        </Gather>
        <Redirect method="POST">
            /loop
        </Redirect>
    </Response>
    `);
});


app.listen(port, () => {
    console.log(`Twilio app listening at http://localhost:${port}`)
  })