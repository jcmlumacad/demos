'use strict';

var socket = io();
var localStream;
var config = {
    "iceServers": [
        {
            "url": "stun:stun.1.google.com:19302"
        }
    ]
};
var rtc = new webkitRTCPeerConnection(config);

console.info("after: WebkitRTCPeerConnection object was created");
console.log("connection", rtc);

function hasUserMedia() {
    return !!(navigator.getUserMedia ||
            navigator.webkitGetUserMedia ||
            navigator.mozGetUserMedia ||
            navigator.msGetUserMedia);
}

if (hasUserMedia()) {
    navigator.getUserMedia({ video: true, audio: true }, function(stream) {
        localStream = stream;
        console.info("after: localStream was created");
        var video = document.querySelector('video');
        console.info("before: create object url for video");
        video.src = window.URL.createObjectURL(stream);
        console.info("after: create object url for video");
    }, function(err) {console.log(err)});
} else {
    alert("Error. WebRTC is not supported!");
}

// function createOffer() {
//     rtc.onicecandidate = function (event) {
//         if (event.candidate != null) {
//             socket.emit("sendCandidate", {
//                 type: 'candidate',
//                 candidate: event.candidate
//             });
//         }
//     };
// }