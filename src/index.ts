import express, {Request, Response} from 'express';
import bodyParser from 'body-parser';
import MessagingResponse from 'twilio/lib/twiml/MessagingResponse.js';
import {InitialResponse} from './utils/response.js';
import mongoose from 'mongoose';
import User from './db/schema.js';

const app = express();
const port = '3000';

app.use(bodyParser.urlencoded({extended: true}));

const uri =
  'mongodb+srv://dylanreeder5:Password12@cluster0.vklcs.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
const clientOptions = {
  serverApi: {version: '1', strict: true, deprecationErrors: true},
} satisfies mongoose.ConnectOptions;

async function startServer() {
  try {
    await mongoose.connect(uri, clientOptions);
    if (mongoose.connection.db) {
      await mongoose.connection.db.admin().command({ping: 1});
    } else {
      throw new Error('Database connection is undefined');
    }
    console.log(
      'Pinged your deployment. You successfully connected to MongoDB!'
    );
    app.listen(port, () => {
      console.log(`Example app listening on port ${port}`);
    });
  } catch (err) {
    console.error('Error connecting to MongoDB:', err);
  }
}

startServer();

app.post('/twilio/sms-status', (req: Request, res: Response) => {
  const {MessageSid, SmsStatus, To, From, ErrorCode, ErrorMessage} = req.body;

  console.log('Received SMS Event:');
  console.log(`Message SID: ${MessageSid}`);
  console.log(`Status: ${SmsStatus}`);
  console.log(`To: ${To}, From: ${From}`);

  if (ErrorCode) {
    console.log(`Error Code: ${ErrorCode}, Message: ${ErrorMessage}`);
  }

  res.status(200).send('SMS event received');
});

app.post('/sms', async (req: Request, res: Response) => {
  const {Body, From} = req.body;
  console.log('Received SMS:', From);

  const user = new User({
    id: From,
    messages: [Body],
    responses: [],
  });
  console.log('saving user');
  await user.save();

  const response = await InitialResponse(Body);
  const twiml = new MessagingResponse();
  twiml.message(response.content || 'No response from AI');

  await User.findOneAndUpdate(
    {id: From},
    {$push: {responses: response.content}}
  );
  res.type('text/xml').send(twiml.toString());
});
