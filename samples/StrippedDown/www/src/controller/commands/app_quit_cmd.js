// =====================================================================================
// ================================   app_quit_cmd.js   ================================
// =====================================================================================
"use strict";

const { app } = require('electron');
const { konsola } = require( app.getAppPath() + '/www/src/utils/log/konsola.js');

// https://www.linkedin.com/pulse/interfaces-javascript-es6-alexey-savchenko-h825f/
const { AbstractCommand } = require('./abstract_command.js')

class AppQuitCmd extends AbstractCommand {
	static #Key = Symbol();
	static #Singleton = new AppQuitCmd( this.#Key );
	static #InstanceCount = 0;

    // ** Private constructor **
	constructor( key ) {
		super();
		if ( key !== AppQuitCmd.#Key ) {
			throw new TypeError("'AppQuitCmd' constructor is private");
		}
        this._name = "QuitApp";
		this._description = "Quit Application";
	} // ** Private constructor ** 'Singleton' design pattern
	
	async run( args ) {
		konsola.warn('> AppQuitCmd.run()');
		let run_result = await super.run(args); 
		if (! run_result) {
			this.electron_main.quitApp();
		}
	} // async run()
	
	static get This() {
		if( AppQuitCmd.#Singleton == undefined ) {
			this.#Singleton = new AppQuitCmd();
			if (this.#InstanceCount > 0) {
				throw new TypeError("'AppQuitCmd' constructor called more than once");
			}
			this.#InstanceCount++;
        }
        return AppQuitCmd.#Singleton;
    } // AppQuitCmd get This	
} // AppQuitCmd class

// NB: checked: 'let app_quit_cmd_obj = new AppQuitCmd();' raises Exception

// https://stackoverflow.com/questions/10914751/loading-node-js-modules-dynamically-based-on-route/12259975
module.exports = function(module_holder) {
    // the key in this dictionary can be whatever you want just make sure it won't override other modules
	// konsola.log(">> Adding 'AppQuitCmd' export_func");
    module_holder['AppQuitCmd'] = AppQuitCmd.This;
	return module_holder;
};