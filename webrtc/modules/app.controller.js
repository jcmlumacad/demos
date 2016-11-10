(function() {
    'use strict';
    angular
        .module('chat')
        .controller('AppController', AppController);
    AppController.$inject = ['service', '$window'];

    function AppController(service, $window) {
        var vm = this;
        var socket = io();
        var localStream;
        var userVideo;
        var friendVideo;
        var config = {
            "iceServers": [{
                "url": "stun:stun.1.google.com:19302"
            }]
        };
        var rtc = new webkitRTCPeerConnection(config);
        console.info("after: WebkitRTCPeerConnection object was created");

        vm.login = function() {
            console.info("before: press login button");
            socket.emit("setUsername", vm.username);
            console.info("after: press login button");
        };

        vm.connect = function() {
            console.info("before: press establish connection button");
            rtc.createOffer().then(function(offer) {
                // console.info("offer:", offer);
                rtc.setLocalDescription(offer, function() {
                    socket.emit("sendOffer", {
                        type: 'offer',
                        offer: offer,
                        friend: vm.connectTo,
                        user: vm.username
                    });
                    // socket.emit("send", {
                    //     data: offer,
                    //     username: vm.username,
                    //     friend: vm.connectTo
                    // });
                }, function(err) {
                    console.warn(err);
                });
                console.info("offer sent to", vm.connectTo);
            }, function(error) {
                console.warn(error);
            });
            console.info("after: press establish connection button");
        };

        if (service.hasUserMedia()) {
            $window.navigator.getUserMedia({ video: true, audio: true }, function(stream) {
                localStream = stream;
                console.info("after: localStream was created");
                userVideo = document.querySelector('#user');
                friendVideo = document.querySelector('#friend');
                console.info("before: create object url for userVideo");
                userVideo.src = window.URL.createObjectURL(stream);
                console.info("after: create object url for userVideo");

                rtc.addStream(localStream);
            }, function(err) { console.log(err) });
        } else {
            alert("Error. WebRTC is not supported!");
        }

        function getUserMedia() {
            $window.navigator.getUserMedia({ video: true, audio: true }, function(stream) {
                localStream = stream;
                console.info("after: localStream was created");
                userVideo = document.querySelector('#user');
                friendVideo = document.querySelector('#friend');
                console.info("before: create object url for userVideo");
                userVideo.src = window.URL.createObjectURL(stream);
                console.info("after: create object url for userVideo");

                rtc.addStream(localStream);
            }, function(err) { console.log(err) });
        }

        rtc.onaddstream = function(event) {
            console.info("before: create object url for friendVideo");
            friendVideo.src = window.URL.createObjectURL(event.stream);
            console.info("after: create object url for friendVideo");
        };

        rtc.onicecandidate = function(event) {
            console.info("fire: onicecandidate");
            if (event.candidate) {
                console.info("fire: send candidate");
                socket.emit("sendCandidate", {
                    type: 'candidate',
                    candidate: event.candidate,
                    friend: vm.connectTo
                });
            }
        };

        socket.on("receiveOffer", function(result) {
            console.info("received offer from", result.user);
            // console.log(result);
            // console.info("result (offer):", result);
            rtc.setRemoteDescription(new RTCSessionDescription(result.offer));
            rtc.createAnswer().then(function(answer) {
                // console.info("answer:", answer);
                console.log(vm.username);
                rtc.setLocalDescription(answer, function() {
                    socket.emit("sendAnswer", {
                        type: 'answer',
                        answer: answer,
                        friend: result.user,
                        user: result.friend
                    });
                }, function(err) {
                    console.warn(err);
                });
                console.info("answer sent to", result.user);
            }, function(error) {
                console.warn(error);
            });
        });

        socket.on("receiveAnswer", function(result) {
            console.info("received answer from", result.user);
            // console.info("result (answer):", result);
            rtc.setRemoteDescription(new RTCSessionDescription(result.answer));
        });

        socket.on("sendCandidate", function(result) {
            console.info("broadcast starts now");
            rtc.addIceCandidate(new RTCIceCandidate(result.candidate), function() {
                console.info('success ice candidate');
            }, function(err) {
                console.warn(err);
            });
        });

        // socket.on("receive", function(result) {
        //     console.log("receive called");
        // });
    }
})();
