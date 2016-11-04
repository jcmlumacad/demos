'use strict';

module.exports = function(io) {
    var handleClient = function(socket) {
        console.log("handleClient called");

        socket.on("setUsername", function(username) {
            console.log("log: setUsername called");
            socket.join(username);
            console.log("log: " + username + " joined");
        });

        socket.on("sendOffer", function(result) {
            socket.to(result.to).emit("receiveOffer", result);
            console.log("creating offer for", result.to);
        });
    };

    io.on("connection", handleClient);
};