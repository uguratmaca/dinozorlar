require('dotenv').config();
const { TwitterClient } = require('twitter-api-client'),
    schedule = require('node-schedule'),
    repplies = ["Yalnız dinozor olacak o!",
        "Bizim adımız dinozor efendim.",
        "Dinazor değil dinozor!",
        "a değil o D-İ-N-O-Z-O-R"
    ];

const twitterClient = new TwitterClient({
    apiKey: process.env.TWITTER_API_KEY,
    apiSecret: process.env.TWITTER_API_SECRET,
    accessToken: process.env.TWITTER_ACCESS_TOKEN,
    accessTokenSecret: process.env.TWITTER_ACCESS_TOKEN_SECRET
});

async function read(sinceTweetId) {
    const data = await twitterClient.tweets.search({ "q": "dinazor", "lang": "tr", "count": 15, "since_id": sinceTweetId });
    await data.statuses.forEach(reply);
}

async function reply(t) {

    if (t.text.includes("dinozor")) {
        return;
    }

    await twitterClient.tweets.statusesUpdate({
        "status": `@${t.user.screen_name} ${getRandomReply()}`,
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

function getRandomReply() {
    return repplies[Math.floor(Math.random() * repplies.length)];
}

async function lastTweetId(t) {
    const data = await twitterClient.tweets.statusesUserTimeline({
        "count": "1",
        "user_id": "1458903909330833408"
    }).catch(
        function (error) {
            throw error;
        });
    return data[0].id_str;
}

async function init() {

    console.log('worker initialized');

    // schedule.scheduleJob('30 07 * * *', async function (fireDate) {
    //     dailyInfo();
    // });

    schedule.scheduleJob('*/15 * * * *', async function (fireDate) {
        const sinceTweetId = await lastTweetId();
        read(sinceTweetId);
    });
}

init();