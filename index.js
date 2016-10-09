'use strict';
var Alexa = require('alexa-sdk');
var req = require('sync-request');

exports.handler = function (event, context, callback) {
  var alexa = Alexa.handler(event, context);
  alexa.registerHandlers(handlers);
  alexa.execute();
};

var handlers = {
  'LaunchRequest': function () {
    console.log('LaunchRequest()');
    this.emit('GetCurrentWeather');
  },

  'GetCurrentWeather': function () {
    console.log('GetCurrentWeather()');
    var body = requestMikesWeather();
    var speechOutput = 'It\'s currently ' + body.wx.temp + body.units.temp + ' and the humidity is ' + body.wx.humidity + body.units.humidity + ".";
    var cardTitle = "Mike's Weather";
    this.emit(':tellWithCard', speechOutput, cardTitle, speechOutput, imageObj);
  },

  'GetCurrentTemperature': function () {
    var body = requestMikesWeather();
    var temp = 'It\'s ' + body.wx.temp + body.units.temp + '.';
    this.emit(':tellWithCard', temp, 'Temperature', temp, imageObj);
  },

  'GetReading': function () {
    console.log('GetReading()');
    var body = requestMikesWeather();
    var reading = this.event.request.intent.slots.reading.value;
    console.log('Incoming reading slot is ' + reading);

    if (reading === 'temperature') {
      this.emit('GetCurrentTemperature');
    } else if (reading === 'dewpoint' || reading === 'dew point') {
      var dewpoint = 'The dewpoint is ' + body.wx.dewpoint + body.units.temp + '.';
      this.emit(':tellWithCard', dewpoint, 'Dewpoint', dewpoint, imageObj);
    } else if (reading === 'pressure' || reading === 'barometer') {
      var pressure = 'The barometric pressure is ' + body.wx.barometer + body.units.barometer + '.';
      this.emit(':tellWithCard', pressure, 'Barometric Pressure', pressure, imageObj);
    } else if (reading === 'weather') {
      this.emit('GetCurrentWeather');
    } else {
      this.emit(':ask', 'Sorry I don\'t recognize that type of reading. ' + DEFAULT_PROMPT, DEFAULT_PROMPT);
    }
  },

  'Unhandled': function () {
    console.log('Unhandled()');
    this.emit('AMAZON.HelpIntent');
  },

  'AMAZON.HelpIntent': function () {
    console.log('HelpIntent()');
    this.emit(':ask', 'What\'s the weather like in Mike\'s backyard? You can ask for the current weather or a specific reading. ' + DEFAULT_PROMPT, DEFAULT_PROMPT);
  }
};

function requestMikesWeather() {
  var res = req('GET', 'http://www.mikesweather.net/wx.json');
  return JSON.parse(res.getBody());
}

var imageObj = {
  smallImageUrl: 'https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcTc-2bRXfcF48bu339kHAGk3EAfDc3X75UE8-dHW2cL1kFtpLHBeg',
  largeImageUrl: 'https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcTc-2bRXfcF48bu339kHAGk3EAfDc3X75UE8-dHW2cL1kFtpLHBeg'
};

var DEFAULT_PROMPT = 'Try saying something like weather, temperature, or dewpoint.';