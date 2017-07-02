const speedTest = require('speedtest-net');
const test = speedTest({maxTime: 10000});
const php = require('phpjs');
const Twitter = require('twitter');


var environment = php.ksort(process.env);

var expected_download = environment.EXPECTED_DOWNLOAD;
var expected_upload = environment.EXPECTED_UPLOAD;

var threshold = environment.THRESHOLD_PERCENTAGE;

var companyTwitterAccount = environment.COMPANY_TWITTER_ACCOUNT;

var twitterClient = new Twitter({
    consumer_key: environment.TWITTER_CONSUMER_KEY,
    consumer_secret: environment.TWITTER_CONSUMER_SECRET,
    access_token_key: environment.TWITTER_ACCESS_TOKEN_KEY,
    access_token_secret: environment.TWITTER_ACCESS_TOKEN_SECRET
});

var send_tweet = function(status){
    console.log("Sending tweet...");
    twitterClient.post('statuses/update', {status: status},  function(error, tweet, response) {
        if(error) throw error;
        console.log("Sent tweet.");
    });
}

test.on('data', data => {

    let percentage_download = (100 / expected_download) * data.speeds.download;
    let percentage_upload   = (100 / expected_upload)   * data.speeds.upload;

    console.log("Download rate is " + data.speeds.download.toFixed(2) + "Mbps which is " + percentage_download.toFixed(0) + "% of " + expected_download + "Mbps.");
    console.log("Upload rate is " + data.speeds.upload.toFixed(2) + "Mbps which is " + percentage_upload.toFixed(0) + "% of " + expected_upload + "Mbps.");
    if(percentage_download < threshold){
        // Download is low.
        send_tweet(companyTwitterAccount + " My Download rate is " + data.speeds.download.toFixed(2) + "Mbps which is " + percentage_download.toFixed(0) + "% of the " + expected_download + "Mbps I'm paying for.")
    }
    if(percentage_upload < threshold){
        // Upload is low.
        send_tweet(companyTwitterAccount + " My Upload rate is " + data.speeds.upload.toFixed(2) + "Mbps which is " + percentage_upload.toFixed(0) + "% of the " + expected_upload + "Mbps I'm paying for.")
    }
});

test.on('error', err => {
    console.error(err);
});
  