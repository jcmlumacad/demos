(function() {
    'use strict';
    angular
        .module('chat')
        .service('service', service);
    service.$inject = ['$window'];

    function service($window) {
        this.hasUserMedia = hasUserMedia;

        function hasUserMedia() {
            return !!($window.navigator.getUserMedia ||
                $window.navigator.webkitGetUserMedia ||
                $window.navigator.mozGetUserMedia ||
                $window.navigator.msGetUserMedia);
        }
    }
})();
