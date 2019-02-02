const express = require('express')
const bodyParser = require('body-parser')
const {dialogflow, Permission, SimpleResponse} = require('actions-on-google')

const https = require('https');
const fs = require('fs');

try {
    var options = {
        key: fs.readFileSync('./ssl/key.pem'),
        cert: fs.readFileSync('./ssl/cert.pem')
    }
}
catch(err){
    console.log("ERROR ON SSL")
}

var port1 = 3005;
var port2 = 443;
const expressApp = express().use(bodyParser.json());

const app = dialogflow({debug: true});

https.createServer(options, expressApp).listen(port2, function(){  
    console.log("Https server listening on port " + port2);
  });

app.intent('welcome_intent', (conv) => {
    console.log(conv)
    conv.ask('a')
    const USERNAME = conv.user.storage.userName
    if(USERNAME){
        conv.ask('안녕하세요 ' + USERNAME +'님 원하시는 학식을 말씀해주세요.' )
    }
    else{
        conv.ask('안녕하세요, 외대학식입니다.')
        conv.ask(new Permission({
            context: "외대학식 서비스 사용을 위해 이름 권한이 필요합니다.",
            permissions: "NAME"
        }))
        
    }
    
})

app.intent('Default Fallback Intent', (conv) => {
    conv.ask(new SimpleResponse({
        speech: "이해하지 못했어요, 다시 말씀해주실래요?",
        text: "다시 말씀해주세요"
    }
    ))
})

app.intent('Show Cafeteria', (conv, {cafeteria}, {date_time}) => {
    console.log(conv)
    conv.ask('abc-Show Cafeteria')
})

app.fallback((conv) => {
    conv.ask('이해못했어요')
})

expressApp.post('/fulfillment', app)
/*

expressApp.listen(port1, () => {
    console.log("= Assistant Server on. Port " + port + " =" )
})
*/