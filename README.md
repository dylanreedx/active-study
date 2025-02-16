# Active Study

![Active Study](active_study.png)

Use convenient active recall to prepare for your next test.

## Tech Stack

- **Node.js + TypeScript**: For building the server-side application.
- **Express**: Web framework for handling HTTP requests.
- **OpenAI API**: For generating AI responses.
- **Twilio API**: For sending and receiving SMS messages.
- **Turso**: Database for storing user data.
- **Drizzle ORM**: For interacting with the SQLite database.
- **Node-cron**: For scheduling cron jobs to send study prompts.
## TODO

- [x] User: "i have a linear algebra exam in a week"
- [x] System: math is too borad, ask for specifics: "what is on? determinants, etc."
- User: "exam is on RREF"
- System: "What's your confidence? What grade do you expect to get if you were to take it rn"
- User: "0%"
- System: "How frequent do you want me to ask questions?
- User: "every 2 hours".

Sparate flow for initial convo and questions?

we need a initial little conversation to "onboard"

cron jobs can handle the generation and sending of questions via freqency interval.

## Getting Started

To get started with this project, follow these steps:

1. **Clone the repository:**
   ```sh
   git clone https://github.com/dylanreedx/active-study.git
   cd active-study
   ```

2. **Install dependencies:**
   ```sh
   npm install
   ```

3. **Set up environment variables:**
   Copy the file `.env.example` as `.env` file in the project root and define your environment variables::
   ```env
    OPENAI_API_KEY=your_openai_api_key

    TWILIO_PHONE_NUMBER= your_twilio_phone_number
    TWILIO_ACCOUNT_SID= your_twilio_account_sid
    TWILIO_AUTH_TOKEN=your_twilio_auth_token
    TURSO_AUTH_TOKEN=your_turso_auth_token
    TURSO_CONNECTION_URL=your_turso_connection_url
   ```

4. **Run the application:**
   ```sh
   npm run dev
   ```

5. **Run the cron job:**
   The cron job is set to run every 30 minutes by default. You can modify the schedule in the index.ts file.

6. **Test the application:**
   You can use tools like Postman to test the endpoints. For example, to test the `/sms` endpoint, send a POST request with the necessary parameters.

## Accessing the Client Folder
The client folder contains the frontend code for the application. To access the client folder, follow these steps:

1. Navigate to the client folder:
```sh
   cd study-dashboard
```

2. Install dependencies for the client:

```sh
npm install
```

3. Run the client application:

```sh
npm run dev
```

Now you are ready to use the application to prepare for your next test with convenient active recall!


