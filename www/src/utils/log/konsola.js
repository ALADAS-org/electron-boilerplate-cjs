// =======================================================================================================
// ==========================================     konsola.js     =========================================
// =======================================================================================================
"use strict";

// ==================== ANSI escape sequences ====================
// https://blog.logrocket.com/using-console-colors-node-js/
// https://gist.github.com/JBlond/2fea43a3049b38287e5e9cefc87b2124
// https://stackoverflow.com/questions/32573654/is-there-a-way-to-create-an-orange-color-from-ansi-escape-characters
const _RED      = '\x1b[1;31m';
const _GREEN    = '\x1b[0;92m';
const _CYAN     = '\x1b[0;96m';
const _YELLOW   = '\x1b[0;93m'; // R:255 G:255 B:0
const _PURPLE   = '\x1b[0;95m';

// RGB ANSI escape sequence
// https://htmlcolorcodes.com/colors/
const _ORANGE        = '\x1b[38;2;220;160;0m'; // R:220 G:160 B:0 
const _DARKER_ORANGE = '\x1b[38;2;200;140;0m'; // R:200 G:140 B:0 

const _BEIGE       = '\x1b[38;2;207;202;178m'; // R:207 G:202 B:178
const _CAMEL       = '\x1b[38;2;193;154;107m'; // R:193 G:154 B:107 - Camel:    #C19A6B rgb(193, 154, 107)
const _CINNAMON    = '\x1b[38;2;210;125;45m';  // R:210 G:125 B:45  - Cinnamon: #D27D2D rgb(210, 125, 45)
const _TAN         = '\x1b[38;2;210;180;140m'; // R:210 G:180 B:140 - Tan:	  #D2B48C rgb(210, 180, 140)
const _LIGHT_BROWN = '\x1b[38;2;150;150;100m'; // R:150 G:150 B:100 

const _GREY      = '\x1b[38;2;150;150;150m'; // R:150 G:150 B:150 
const _GREY_25   = '\x1b[38;2;63;63;63m';    // R:25  G:25  B:25
const _GREY_50   = '\x1b[38;2;127;127;127m'; // R:50  G:50  B:50
const _GREY_75   = '\x1b[38;2;192;192;192m'; // R:75  G:75  B:75

const _END       = '\x1b[0m';
const _CLEAR     = '\x1b[2J';
const _HOME      = '\x1b[H';

const _UP_4      = '\x1b[4A';
const _UP_5      = '\x1b[5A';
const _DOWN_1    = '\x1b[1B';

const _RED_HIGH  = '\x1b[0;91m';
const _BLUE_HIGH = '\x1b[0;94m';

const _WHITE_ON_RED  = '\x1b[0;47m\x1b[41m';
const _BLK_ON_YLW    = '\x1b[0;30m\x1b[43m';
const _BLK_ON_CYAN   = '\x1b[0;30m\x1b[0;104m';
const _BLK_ON_PURPLE = '\x1b[0;30m\x1b[0;105m';

// emergency, alert, critical, error, warning, notice, info, msg, debug
//                             *****  *******  ******  ****  *** *****
const _LOG_LEVELS = [ 'mute', 'none', 'nothing', 
                      'error', 'warn', 'notice', 'info', 'log', 'msg', 'debug', 
					  'all', '*' ]; 

class konsola {
	static LogLevel = _LOG_LEVELS.indexOf('msg');
	
	// static DefaultLogLevel = _LOG_LEVELS.indexOf('log'); // NB: set to 'msg' or 'debug' to show more logs
	static DefaultLogLevel = _LOG_LEVELS.indexOf('all'); // NB: set to 'msg' or 'debug' to show more logs	 
	
	static log( msg ) {
		if ( konsola.LogLevel < _LOG_LEVELS.indexOf('info') ) return;
        if ( typeof exports === 'object' ) {		
			console.log( msg );
		}
		else {		
			console.log( msg );
		}
	} // konsola.log() 
	
	static msg( msg ) {
		// console.log( "konsola.msg LogLevel: " +  konsola.LogLevel + " msg:" + _LOG_LEVELS.indexOf('msg'));
		if ( konsola.LogLevel < _LOG_LEVELS.indexOf('msg') ) return;
        if ( typeof exports === 'object' ) {		
			console.log( konsola.ansify(_GREY, msg) );
		}
		else {		
			console.log( konsola.ansify(_GREY_50, msg) );
		}
	} // konsola.msg() 
	
	static error( msg ) {		
        if ( typeof exports === 'object' ) {		
			console.error( konsola.ansify(_ORANGE, msg) );
		}
		else {		
			console.error( konsola.ansify(_RED, msg) );
		}
	} // konsola.error() 
	
	static info( msg ) {
		if ( konsola.LogLevel < _LOG_LEVELS.indexOf('info') ) return;
		
        if ( typeof exports === 'object' ) {		
			console.info( konsola.ansify(_BEIGE, msg) );
		}
		else {		
			console.info( konsola.ansify(_CAMEL, msg) );	
		}
	} // konsola.info()
	
	static warn( msg ) {
		if ( konsola.LogLevel <= _LOG_LEVELS.indexOf('warn') ) return;
		
        if ( typeof exports === 'object' ) {		
			console.warn( konsola.ansify(_YELLOW, msg) );
		}
		else {		
			console.warn( konsola.ansify(_ORANGE, msg) );
		}
	} // konsola.warn() 

	static notice( msg ) {
		if ( konsola.LogLevel <= _LOG_LEVELS.indexOf('notice') ) return;
		
        if ( typeof exports === 'object' ) {		
			console.warn( konsola.ansify(_LIGHT_BROWN, msg) );
		}
		else {		
			console.warn( konsola.ansify(_ORANGE, msg) );
			console.warn( konsola.ansify(_DARKER_ORANGE, msg) );
		}
	} // konsola.notice() 	
	
	static ansify( color, msg) {
		return color + msg + _END;
	} // konsola.ansify() 
	
	static setLevel( level_str ) {
		if (level_str == undefined || level_str == '') return;
		
		let pos = _LOG_LEVELS.indexOf(level_str);		
		// console.log("konsola.setLevel " + level_str + ":" + pos) ;
		if (pos == -1) {
			throw new TypeError("Invalid level: '" + level_str + "' - valid levels: " + JSON.stringify(_LOG_LEVELS));
        }
		else {
			konsola.LogLevel = pos;
		}
	} // konsola.setLevel() 
	
	static resetLevel() {
		konsola.LogLevel = konsola.DefaultLogLevel;
	} // konsola.setLevel() 
} // konsola class

// https://stackoverflow.com/questions/34550890/how-to-detect-if-script-is-running-in-browser-or-in-node-js
if ( typeof exports === 'object' ) {	
    exports.konsola = konsola
} // exports of 'konsola.js'