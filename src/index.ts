import express, {Request, Response} from 'express';
import bodyParser from 'body-parser';
import MessagingResponse from 'twilio/lib/twiml/MessagingResponse.js';

const app = express();
const port = '3000';

app.use(bodyParser.urlencoded({extended: true}));

app.post('/twilio/sms-status', (req: Request, res: Response) => {
  const {MessageSid, SmsStatus, To, From, ErrorCode, ErrorMessage} = req.body;

  console.log('Received SMS Event:');
  console.log(`Message SID: ${MessageSid}`);
  console.log(`Status: ${SmsStatus}`);
  console.log(`To: ${To}, From: ${From}`);

  if (ErrorCode) {
    console.log(`Error Code: ${ErrorCode}, Message: ${ErrorMessage}`);
  }

  // Respond to Twilio
  res.status(200).send('SMS event received');
});

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
