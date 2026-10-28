// ==========================================================================================
// ==============================   toggle_fullscreen_cmd.js   ==============================
// ==========================================================================================
"use strict";

const { app } = require('electron');

const { konsola } = require( app.getAppPath() + '/www/src/utils/log/konsola.js');

const {  FromMain_DOM_SET_NODE_VISIBILITY
	  } = require(app.getAppPath() + '/www/src/const_events.js');
	
const {  COMMAND_PALETTE_CONTENT_ID
	  } = require(app.getAppPath() + '/www/src/view/const_view.js');	  

// https://www.linkedin.com/pulse/interfaces-javascript-es6-alexey-savchenko-h825f/
const { AbstractCommand } = require('./abstract_command.js')

class ToggleFullScreenCmd extends AbstractCommand {
	static #Key = Symbol();
	static #Singleton = new ToggleFullScreenCmd( this.#Key );
	static #InstanceCount = 0;

    // ** Private constructor **
	constructor( key ) {
		super();
		if ( key !== ToggleFullScreenCmd.#Key ) {
			throw new TypeError("'ToggleFullScreenCmd' constructor is private");
		}
        this._name = "ToggleFullScreenCmd";
		this._description = "Toggle Full Screen";
	} // ** Private constructor ** 'Singleton' design pattern
	
	// fill UL List
	// https://stackoverflow.com/questions/11128700/create-a-ul-and-fill-it-based-on-a-passed-array
	
	async run( args ) {
		// konsola.msg('-> ToggleFullScreenCmd.run()');
		let run_result = await super.run(args); 
		if (! run_result) {
			this.electron_main.toggleFullScreen();
		}
	} // async run()
	
	static get This() {
		if( ToggleFullScreenCmd.#Singleton == undefined ) {
			this.#Singleton = new ToggleFullScreenCmd();
			if (this.#InstanceCount > 0) {
				throw new TypeError("'ToggleFullScreenCmd' constructor called more than once");
			}
			this.#InstanceCount++;
        }
        return ToggleFullScreenCmd.#Singleton;
    } // ToggleFullScreenCmd get This	
} // ToggleFullScreenCmd class

// https://stackoverflow.com/questions/10914751/loading-node-js-modules-dynamically-based-on-route/12259975
module.exports = function(module_holder) {
    // the key in this dictionary can be whatever you want just make sure it won't override other modules
	// konsola.log(">> Adding 'ToggleFullscreenCmd' export_func");
	module_holder['ToggleFullScreenCmd'] = ToggleFullScreenCmd.This;
	return module_holder;
};