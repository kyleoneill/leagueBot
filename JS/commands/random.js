const lanesList = require('../config/lanes.json');

module.exports = {
    name:'random',
    execute(message, args) {
        var messageText;
        if(!args.length){
            lanes = ["top", "mid", "bot", "support", "jungle"];
            randomLane = lanes[Math.floor(Math.random() * lanes.length)];
            messageText = `You'll be playing ${getRandomChampion(randomLane).toProper()} ${randomLane.toProper()} this game. Have fun!`;
        }
        else{
            messageText = "You're going to be playing ";
            var laneExists = true;
            switch(args[0]) {
                case "top":
                    messageText += getRandomChampion("top").toProper();
                    break;
                case "mid":
                    messageText += getRandomChampion("mid").toProper();
                    break;
                case "bot":
                    messageText += getRandomChampion("bot").toProper();
                    break;
                case "support":
                    messageText += getRandomChampion("support").toProper();
                    break;
                case "jungle":
                    messageText += getRandomChampion("jungle").toProper();
                    break;
                default:
                    laneExists = false;
                    messageText = "That lane doesn't exist. Please use 'top', 'mid', 'bot', 'support', and 'jungle'.";
            }
            if(laneExists){
                messageText += " this game, have fun!";
            }
        }
        message.channel.send(messageText);
    }
}

function getRandomChampion(lane){
    var champList = lanesList[lane];
    return champList[Math.floor(Math.random() * champList.length)];
}
