import express from 'express';
import MessagingResponse from 'twilio/lib/twiml/MessagingResponse.js';
const app = express();
const port = '3000';
app.get('/sms', (req, res) => {
    // listen for initial text
    res.send('Hello World!');
    console.log('Response sent');
});
app.post('/sms', (req, res) => {
    const twiml = new MessagingResponse();
    twiml.message('The Robots are coming! Head for the hills!');
    res.type('text/xml').send(twiml.toString());
});
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
