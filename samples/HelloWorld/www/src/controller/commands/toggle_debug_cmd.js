// =======================================================================================
// ===============================   toggle_debug_cmd.js   ===============================
// =======================================================================================
"use strict";

const { app } = require('electron');
const { konsola } = require( app.getAppPath() + '/www/src/utils/log/konsola.js');

// https://www.linkedin.com/pulse/interfaces-javascript-es6-alexey-savchenko-h825f/
const { AbstractCommand } = require('./abstract_command.js')

class ToggleDebugCmd extends AbstractCommand {
	static #Key = Symbol();
	static #Singleton = new ToggleDebugCmd( this.#Key );
	static #InstanceCount = 0;

    // ** Private constructor **
	constructor( key ) {
		super();
		if ( key !== ToggleDebugCmd.#Key ) {
			throw new TypeError("'ToggleDebugCmd' constructor is private");
		}
        this._name = "ToggleDebug";
		this._description = "Toggle Debug panel";
	} // ** Private constructor ** 'Singleton' design pattern
	
	async run( args ) {
		// konsola.msg('-> ToggleDebugCmd.run()');
		let run_result = await super.run(args); 
		if (! run_result) {
			this.electron_main.toggleDebugPanel();
		}
	} // run()
	
	static get This() {
		if( ToggleDebugCmd.#Singleton == undefined ) {
			this.#Singleton = new ToggleDebugCmd();
			if (this.#InstanceCount > 0) {
				throw new TypeError("'ToggleDebugCmd' constructor called more than once");
			}
			this.#InstanceCount++;
        }
        return ToggleDebugCmd.#Singleton;
    } // ToggleDebugCmd get This	
} // ToggleDebugCmd class

// https://stackoverflow.com/questions/10914751/loading-node-js-modules-dynamically-based-on-route/12259975
module.exports = function(module_holder) {
    // the key in this dictionary can be whatever you want just make sure it won't override other modules
	// konsola.log(">> Adding 'ToggleDebugCmd' export_func");
	module_holder['ToggleDebugCmd'] = ToggleDebugCmd.This;
	return module_holder;
};