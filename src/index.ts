import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';

const app = express();
const port = '3000';

app.use(bodyParser.urlencoded({ extended: true }));

app.post("/twilio/sms-status", (req: Request, res: Response) => {
  const { MessageSid, SmsStatus, To, From, ErrorCode, ErrorMessage } = req.body;

  console.log("Received SMS Event:");
  console.log(`Message SID: ${MessageSid}`);
  console.log(`Status: ${SmsStatus}`);
  console.log(`To: ${To}, From: ${From}`);

  if (ErrorCode) {
      console.log(`Error Code: ${ErrorCode}, Message: ${ErrorMessage}`);
  }

  // Respond to Twilio
  res.status(200).send("SMS event received");
});


app.get('/', (req: Request, res: Response) => {
  res.send('Hello World!');
  console.log('Response sent');
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
