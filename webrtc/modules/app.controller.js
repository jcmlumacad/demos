(function() {
    'use strict';
    angular
        .module('chatApp')
        .controller('AppController', AppController);

    function AppController() {
        var vm = this;

        vm.login = function() {
            console.info("before: press login button");
            socket.emit("setUsername", vm.username);
            console.info("after: press login button");
        };

        vm.connect = function() {
            console.info("before: press establish connection button");
            rtc.createOffer().then(function (offer) {
                console.info("offer:", offer);
                rtc.setLocalDescription(offer, function() {
                    socket.emit('sendOffer', {
                        type: 'offer',
                        offer: offer,
                        to: vm.connectTo,
                        user: vm.username
                    });
                    console.info("offer sent to", vm.connectTo);
                }, function (error) {
                    console.warn(error);
                });
            }, function (error) {
                console.warn(error);
            });
            console.info("after: press establish connection button");
        };
    }
})();