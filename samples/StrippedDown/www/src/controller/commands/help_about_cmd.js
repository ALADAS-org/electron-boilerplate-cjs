// =====================================================================================
// ===============================   help_about_cmd.js   ===============================
// =====================================================================================
"use strict";

const { app } = require('electron');
const { konsola } = require( app.getAppPath() + '/www/src/utils/log/konsola.js');

const { L10n } = require(app.getAppPath() + '/www/L10n/L10n.js');

const { AppModel } = require(app.getAppPath() + '/www/src/model/app_model.js');

const {  APP_VERSION_KEY, MAIN_WINDOW_KEY
	  } = require(app.getAppPath() + '/www/src/model/const_model_keys.js');

const {  FromMain_HELP_ABOUT_CMD, ToMain_RQ_GET_L10N_MSG
	  } = require(app.getAppPath() + '/www/src/const_events.js');
	  
// https://www.linkedin.com/pulse/interfaces-javascript-es6-alexey-savchenko-h825f/
const { AbstractCommand } = require('./abstract_command.js')

class HelpAboutCmd extends AbstractCommand {
	static #Key = Symbol();
	static #Singleton = new HelpAboutCmd( this.#Key );
	static #InstanceCount = 0;

    // ** Private constructor **
	constructor( key ) {
		super();
		if ( key !== HelpAboutCmd.#Key ) {
			throw new TypeError('HelpAboutCmd constructor is private.');
		}
        this._name = "HelpAbout";
		this._description = "Show 'Help/About...'";
	} // ** Private constructor ** 'Singleton' design pattern
	
	async run( args ) {
		konsola.msg('-> HelpAboutCmd.run()');
		let run_result = await super.run(args); 
		if (! run_result) {
			let app_version = AppModel.This.getValue(APP_VERSION_KEY);
			let main_window = AppModel.This.getValue(MAIN_WINDOW_KEY);
			
			let title   = L10n.This.getMsg("AppTitle");
            let content = L10n.This.getMsg("HelpAboutMsg");			
			await main_window.webContents.send( "fromMain", [ FromMain_HELP_ABOUT_CMD, title, content ] );
		}
	} // async run()
	
	static get This() {
		if( HelpAboutCmd.#Singleton == undefined ) {
			this.#Singleton = new HelpAboutCmd();
			if (this.#InstanceCount > 0) {
				throw new TypeError("HelpAboutCmd constructor called more than once.");
			}
			this.#InstanceCount++;
        }
        return HelpAboutCmd.#Singleton;
    } // HelpAboutCmd get This	
} // HelpAboutCmd class

// https://stackoverflow.com/questions/10914751/loading-node-js-modules-dynamically-based-on-route/12259975
module.exports = function(module_holder) {
    // the key in this dictionary can be whatever you want
    // just make sure it won't override other modules
	// konsola.log(">> Adding 'HelpAboutCmd' export_func");
    module_holder['HelpAboutCmd'] = HelpAboutCmd.This;
	return module_holder;
};