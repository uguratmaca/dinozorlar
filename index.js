require('dotenv').config();
const { TwitterClient } = require('twitter-api-client'),
    schedule = require('node-schedule');

const twitterClient = new TwitterClient({
    apiKey: process.env.TWITTER_API_KEY,
    apiSecret: process.env.TWITTER_API_SECRET,
    accessToken: process.env.TWITTER_ACCESS_TOKEN,
    accessTokenSecret: process.env.TWITTER_ACCESS_TOKEN_SECRET
});

async function read() {
    const data = await twitterClient.tweets.search({ "q": "dinazor", "lang": "tr", "count": 1, "since_id": "1459251059562528776" });
    await data.statuses.forEach(reply);
}

async function reply(t) {
    await twitterClient.tweets.statusesUpdate({
        "status": "@" + t.user.screen_name + " Yalnız dinozor olacak o!",
        "in_reply_to_status_id": t.id_str
    }).catch(
        function (error) {
            throw error;
        });
}

function dailyInfo(t) {
    twitterClient.tweets.statusesUpdate({
        "status": "Roaaaaaaaaaaar!"
    }).catch(
        function (error) {
            throw error;
        });
}

function init() {

    console.log('worker initialized');

    schedule.scheduleJob('30 07 * * *', function (fireDate) {
        dailyInfo();
    });

    schedule.scheduleJob('*/5 * * * *', function (fireDate) {
        read();
    });
}


init();