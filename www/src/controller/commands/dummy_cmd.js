// ======================================================================================
// ==================================   dummy_cmd.js   ==================================
// ======================================================================================
// Purpose: Delegate Design Pattern 
"use strict";

const { app } = require('electron');
const { konsola } = require( app.getAppPath() + '/www/src/utils/log/konsola.js');

// konsola.info("__dirname: " + __dirname);

const { NullCmd }         = require('./null_cmd.js');
const { HelpAboutCmd }    = require('./help_about_cmd.js');
const { AbstractCommand } = require('./abstract_command.js');

class DummyCmd extends AbstractCommand {
	static #key = Symbol();
	static #_Singleton = new DummyCmd( this.#key );
	static #_InstanceCount = 0;

    // ** Private constructor **
	constructor( key ) {
		super();
		if ( key !== DummyCmd.#key ) {
			throw new TypeError("'DummyCmd' constructor is private.");
		}
        this.name = "DummyCmd";
	} // ** Private constructor ** 'Singleton' design pattern
	
	async run( args ) {
		konsola.msg('-> DummyCmd.run()');
		let run_result = await super.run(args); 
		if (! run_result) {
			// Do Nothing because it's Dummy and 'delegate' must be set to be useful;
		}
	} // async run()
	
	static get This() {
		if( DummyCmd.#_Singleton == undefined ) {
			this.#_Singleton = new DummyCmd();
			if (this.#_InstanceCount > 0) {
				throw new TypeError("'DummyCmd' constructor called more than once.");
			}
			this.#_InstanceCount++;
        }
        return DummyCmd.#_Singleton;
    } // DummyCmd get This	
} // DummyCmd class

// https://stackoverflow.com/questions/10914751/loading-node-js-modules-dynamically-based-on-route/12259975
module.exports = function(module_holder) {
    // the key in this dictionary can be whatever you want just make sure it won't override other modules
	// konsola.log(">> Adding 'DummyCmd' export_func");
    module_holder['DummyCmd'] = DummyCmd.This;
	return module_holder;
};