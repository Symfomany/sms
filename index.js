// curl -X POST https://api.nexmo.com/v1/calls \
// -H "Authorization: Bearer "$APP_JWT \
// -H "Content-Type: application/json" \
// -d '{"to":[{"type": "phone","number": 33689543496}],
// "from": {"type": "phone","number": 33674585648},
// "answer_url":["https://nexmo-community.github.io/ncco-examples/first_call_talk.json"]}'
const Nexmo = require("nexmo");
const app = require("express")();
const privateKey = require("fs").readFileSync("privat.key");
// console.log(privateKey);
const nexmo = new Nexmo(
  {
    apiKey: "a081d106",
    apiSecret: "bwbRShJzn1m2AJuY",
    applicationId: "2c79c2e8-6fc9-419b-8e5d-33699ba33a7c",
    privateKey: privateKey
  },
  { debug: true }
);

// nexmo.calls.create({
//   to: [
//     {
//       type: "phone",
//       number: "33665267940"
//     }
//   ],
//   from: {
//     type: "phone",
//     number: "33689543496"
//   },
//   answer_url: ["https://developer.nexmo.com/ncco/tts.json"]
// });

nexmo.calls.create(
  {
    to: [
      {
        type: "phone",
        number: "33689543496" // take a phone number from command line argument
      }
    ],
    from: {
      type: "phone",
      number: "0674585648" // your virtual number
    },
    answer_url: [
      "https://nexmo-community.github.io/ncco-examples/first_call_talk.json"
    ]
  },
  (err, res) => {
    if (err) {
      console.error(err);
    } else {
      console.log(res);
    }
  }
);

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
