(function (SockJS) {
	'use strict';

	SockJS = SockJS && SockJS.hasOwnProperty('default') ? SockJS['default'] : SockJS;

	console.log('init reloader bg');

	window.sockjs = new SockJS('ws://localhost:8005');

}(SockJS));
