module.exports = {
    getTime: function() {
        var timeStamp = (new Date()).toLocaleString('en-US')
        return timeStamp
    }
}