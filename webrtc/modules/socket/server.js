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
            socket.to(result.friend).emit("receiveOffer", result);
            console.log("log: offer for", result.friend);
        });

        socket.on("sendAnswer", function(result) {
            socket.to(result.friend).emit("receiveAnswer", result);
            console.log("log: answer for", result.friend);
        });

        socket.on("sendCandidate", function(result) {
            socket.to(result.friend).emit("sendCandidate", result);
            console.log("log: candidate for", result.friend);
        });

        // socket.on("send", function(result) {
        //     console.log("send called")
        //     socket.to(result.friend).emit("receive", result);
        // });
    };

    io.on("connection", handleClient);
};
