// ======================================================================================
// ===============================   hello_world_cmd.js   ===============================
// ======================================================================================
"use strict";

const { app } = require('electron');
const { konsola } = require( app.getAppPath() + '/www/src/utils/log/konsola.js');

const { AppModel } = require(app.getAppPath() + '/www/src/model/app_model.js');

const { MAIN_WINDOW_KEY
	  } = require(app.getAppPath() + '/www/src/model/const_model_keys.js');

const {  FromMain_SHOW_DIALOG_CMD
	  } = require(app.getAppPath() + '/www/src/const_events.js');
	  
// https://www.linkedin.com/pulse/interfaces-javascript-es6-alexey-savchenko-h825f/
const { AbstractCommand } = require('./abstract_command.js')

class HelloWorldCmd extends AbstractCommand {
	static #Key = Symbol();
	static #_Singleton = new HelloWorldCmd( this.#Key );
	static #_InstanceCount = 0;

    // ** Private constructor **
	constructor( key ) {
		super();
		if ( key !== HelloWorldCmd.#Key ) {
			throw new TypeError('HelloWorldCmd constructor is private');
		}
        this.name = "HelloWorld";
		this.description = "Displays 'Hello World'";
	} // ** Private constructor ** 'Singleton' design pattern
	
	async run( args ) {
		// konsola.msg('-> HelloWorldCmd.run() key: ' + this.getKey());
		let run_result = await super.run(args); 
		if (! run_result) {
			// ToDo: display 'Help About message' in a Popup Dialog
			konsola.msg('-> HelloWorldCmd.run()');
			let main_window = AppModel.This.getValue(MAIN_WINDOW_KEY);
			await main_window.webContents.send( "fromMain", [ FromMain_SHOW_DIALOG_CMD, "Hello World" ] );
		}
	} // async run()
	
	static get This() {
		if( HelloWorldCmd.#_Singleton == undefined ) {
			this.#_Singleton = new HelloWorldCmd();
			if (this.#_InstanceCount > 0) {
				throw new TypeError("HelloWorldCmd constructor called more than once.");
			}
			this.#_InstanceCount++;
        }
        return HelloWorldCmd.#_Singleton;
    } // HelloWorldCmd get This	
} // HelloWorldCmd class

// https://stackoverflow.com/questions/10914751/loading-node-js-modules-dynamically-based-on-route/12259975
module.exports = function(module_holder) {
    // the key in this dictionary can be whatever you want
    // just make sure it won't override other modules
	// konsola.log(">> Adding 'HelloWorldCmd' export_func");
    module_holder['HelloWorldCmd'] = HelloWorldCmd.This;
	return module_holder;
};