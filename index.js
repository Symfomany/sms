// curl -X POST https://api.nexmo.com/v1/calls \
// -H "Authorization: Bearer "$APP_JWT \
// -H "Content-Type: application/json" \
// -d '{"to":[{"type": "phone","number": 33689543496}],
// "from": {"type": "phone","number": 33674585648},
// "answer_url":["https://nexmo-community.github.io/ncco-examples/first_call_talk.json"]}'
const Nexmo = require("nexmo");
const app = require("express")();
const bodyParser = require('body-parser')


// parse application/json
app.use(bodyParser.json())
app.set('port', (process.env.PORT || 3000));
const privateKey = require("fs").readFileSync("privat.key");
// console.log(privateKey);

const Promise = require('bluebird');
const ngrok = require('ngrok');
const SPACER = '\n****\n\n';

const config = require('./config.js');

/**
 * Initiation
 */
const nexmo = new Nexmo(
  {
    apiKey: "a081d106",
    apiSecret: "bwbRShJzn1m2AJuY",
    applicationId: "2c79c2e8-6fc9-419b-8e5d-33699ba33a7c",
    privateKey: privateKey
  },
  { debug: true }
);


const calls = Promise.promisifyAll(nexmo.calls);
const stream = Promise.promisifyAll(nexmo.calls.stream);

const callback = () => console.log("C'est terminé !!");

// nexmo.message.sendSms("33674596635", "33674585648", "Hello Man 😊", (res) => console.log("Okayy !!"));
// nexmo.message.sendWapPushMessage("33674596635", "33674585648", "<body>Depanes et <i>moi</i></body>", "https://depannetmoi.homeserve.fr/");

// let verifyRequestId = null; // use in the check process

// nexmo.verify.request({
//   number: "33674585648", brand: "last"
// }, (err, result) => {
//   if (err) {
//     console.error(err);
//   } else {
//     verifyRequestId = result.request_id;
//     console.log('request_id', verifyRequestId);
//   }
// });



// const REQUEST_ID = process.argv[2];
// if (!REQUEST_ID) {
//   console.error('Please supply the `request_id`');
//   return;
// }

// const CODE = process.argv[3];
// if (!CODE) {
//   console.error('Please supply the confirmation code');
//   return;
// }

// nexmo.verify.check({
//   request_id: REQUEST_ID,
//   code: CODE
// }, (err, result) => {
//   if (err) {
//     console.error(err);
//   } else {
//     console.log(result);
//   }
// });



// nexmo.calls.create({
//   to: [{
//     type: 'phone',
//     number: "33674585648"
//   }],
//   from: {
//     type: 'phone',
//     number: "33427786856"
//   },
//   answer_url: ['https://raw.githubusercontent.com/Symfomany/sms/master/talk.json']
// }, () => console.log("Okayy")
// );

// nexmo.calls.stream.start(
//   callId,
//   {
//     stream_url: [
//       'https://nexmo-community.github.io/ncco-examples/assets/voice_api_audio_streaming.mp3'
//     ],
//     loop: 1
//   });

// nexmo.numberInsight.get({ level: 'basic', number: "33699999999" },
//   (err, result) => {
//     if (err) {
//       console.error(err);
//     } else {
//       console.log(result);
//     }
//   });




/**
 * Stream 1
 */


app.get('/', function (req, res) {
  res.send('hello');
});

// Handle events
var callId = null;
app.post('/', function (req, res) {
  console.log('Request received', req.body);
  // Hack: seeing two inbound webhook requests.
  // Use callId to indicate this.
  if (req.body.status === 'answered' && !callId) {
    callId = req.body.uuid;

    console.log('Call answered with call_uuid', callId)

    setTimeout(function () {
      sendTalk(callId);
    }, 5000);
  }

  res.sendStatus(204);
});

var server = app.listen(app.get('port'), makeCall);

function makeCall() {
  console.log('Web server listening on port', app.get('port'));

  console.log('calling', config.TO_NUMBER);
  return calls.createAsync({
    to: [{
      type: 'phone',
      number: config.TO_NUMBER
    }],
    from: {
      type: 'phone',
      number: config.FROM_NUMBER
    },
    answer_url: ['https://nexmo-community.github.io/ncco-examples/conference.json'],
    event_url: ["http://localhost:3000/"]
  });
}

function sendTalk(callId) {
  console.log('Sending a talk into the call')
  return talk.startAsync(callId, {
    text: "Sean... He's on the beach now, a toe in the water. He's asking you to come in with him. He's been racing his mother up and down the sand. There's so much love in this house. He's ten years old. He's surrounded by animals. He wants to be a vet. You keep a rabbit for him, a bird and a fox. He's in high school. He likes to run, like his father.",
    voice_name: 'Emma',
    loop: 0
  })
    .then(function (resp) {
      console.log('talk.start response', resp);

      console.log('waiting a short time');
      return Promise.delay(5000);
    })
    .then(function () {
      console.log(SPACER, 'Stopping talking');

      return talk.stopAsync(callId);
    })
    .then(function (res) {
      console.log('talk.stop res', res);

      return calls.updateAsync(callId, { action: 'hangup' });
    })
    .then(function (res) {
      console.log('calls.update', res);

      server.close();
      ngrok.kill();

      return Promise.delay(2000);
    })
    .then(function () {
      callback(null, null);
    })
    .catch(function (err) {
      if (server) server.close();
      if (ngrok) ngrok.kill();

      callback(err);
    });
}










/*
Streams.. 2

function randomPort() {
  // Math.floor(Math.random() * (7000 - 3000 + 1) + 3000)
  return 3000;
}

app.set('port', (process.env.PORT || randomPort()));
app.use(require('body-parser').json());

app.get('/', function (req, res) {
  res.send('hello');
});


// Handle events
var callId = null;
app.post('/', function (req, res) {
  console.log('Request received', req.body);
  // Hack: seeing two inbound webhook requests.
  // Use callId to indicate this.
  if (req.body.status === 'answered' && !callId) {
    callId = req.body.uuid;

    console.log('Call answered with call_uuid', callId)

    setTimeout(function () {
      sendStream(callId);
    }, 3000);
  }

  res.sendStatus(204);
});

const server = app.listen(app.get('port'), makeCall);

function makeCall() {
  console.log('Web server listening on port', app.get('port'));


  Promise.promisify(ngrok.connect)(app.get('port'))
    .then(function (url) {
      console.log('ngrok tunnel set up:', url);

      console.log('calling', "0674585648");
      return calls.createAsync({
        to: [{
          type: 'phone',
          number: "33674585648"
        }],
        from: {
          type: 'phone',
          number: "33427786856"
        },
        answer_url: ['https://nexmo-community.github.io/ncco-examples/conference.json'],
        event_url: [url]
      });
    })
    .then(function (res) {
      console.log('call in progress', res);
    })
    .catch(callback);
}

function sendStream(callId) {

  stream.startAsync(
    callId,
    {
      stream_url: [
        'https://nexmo-community.github.io/ncco-examples/assets/voice_api_audio_streaming.mp3'
      ],
      loop: 1
    })
    .then(function (resp) {
      console.log('stream.start response', resp);

      console.log('waiting a short time');
      return Promise.delay(2000);
    })
    .then(function (resp) {
      console.log('stopping the stream', resp);

      return nexmo.calls.stream.stopAsync(callId);
    })
    .then(function (res) {
      console.log('stream.stop res', res);

      console.log('waiting a short time');
      return Promise.delay(2000);
    })
    .then(function (res) {
      return calls.updateAsync(callId, { action: 'hangup' });
    })
    .then(function (res) {
      console.log('calls.update', res);

      server.close();
      ngrok.kill();

      return Promise.delay(2000);
    })
    .then(function () {
      callback(null, null);
    })
    .catch(function (err) {
      if (server) server.close();
      if (ngrok) ngrok.kill();

      callback(err);
    });
}
*/






// The fundamental building block of the Voice API is an NCCO, the Nexmo Call Control Object.
//  This is a set of instructions that control the flow of a call, 
//  and is downloaded by Nexmo from your answer URL. 

//  You must host this answer URL on your web server.
// Exemple: https://developer.nexmo.com/ncco/tts.json
// Playground: https://dashboard.nexmo.com/voice/playground/test

// nexmo.calls.create({
//   to: [
//     {
//       type: "phone",
//       number: "0674585648"
//     }
//   ],
//   from: {
//     type: "phone",
//     number: "33689543496"
//   },
//   answer_url: ["https://developer.nexmo.com/ncco/tts.json"]
// });

// nexmo.calls.create(
//   {
//     to: [
//       {
//         type: "phone",
//         number: "33689543496" // take a phone number from command line argument
//       }
//     ],
//     from: {
//       type: "phone",
//       number: "0674585648" // your virtual number
//     },
//     answer_url: [
//       "https://nexmo-community.github.io/ncco-examples/first_call_talk.json"
//     ]
//   },
//   (err, res) => {
//     if (err) {
//       console.error(err);
//     } else {
//       console.log(res);
//     }
//   }
// );

// const onInboundCall = (request, response) => {
//   const ncco = [
//     {
//       action: "connect",
//       endpoint: [
//         {
//           type: "phone",
//           number: "33665267940"
//         }
//       ]
//     }
//   ];

//   response.json(ncco);
// };
// app.get("/webhooks/answer", onInboundCall);

// app.listen(3000);

// const TEXT =
//   "This is some sample text to speech text. It could go on and on and never end.";

// nexmo.calls.talk.start(
//   CALL_UUID,
//   { text: TEXT, voiceName: "Emma", loop: 2 },
//   (err, res) => {
//     if (err) {
//       console.error(err);
//     } else {
//       console.log(res);
//     }
//   }
// );

// nexmo app:create "Okay" https://example.com \
// https://example.com --type=voice --keyfile=privaty.key

// APP_JWT="$(nexmo jwt:generate ./privaty.key application_id=Okay)"

// const Nexmo = require("nexmo");
// const nexmo = new Nexmo({
//   apiKey: "a081d106",
//   apiSecret: "bwbRShJzn1m2AJuY"
// });

// const from = "33665267940";
// const to = "33689543496";
// const text = "J'ai envie de toi... Manu.";

// nexmo.message.sendSms(from, to, text);
