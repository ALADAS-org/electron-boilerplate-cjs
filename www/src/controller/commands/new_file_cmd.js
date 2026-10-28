// =====================================================================================
// ================================   new_file_cmd.js   ================================
// =====================================================================================
"use strict";

const { app } = require('electron');
const { konsola } = require( app.getAppPath() + '/www/src/utils/log/konsola.js');

const { L10n } = require( app.getAppPath() + '/www/L10n/L10n.js' );

const { FromMain_DOM_SET_NODE_ATTRIBUTE
	  } = require(app.getAppPath() + '/www/src/const_events.js');
	  
const { QRCODE_IMG_ID, QRCODE_MSG_ID, QRCODE_MSG_PLACEHOLDER_ID
	  } = require(app.getAppPath() + '/www/src/view/const_view.js');

// https://www.linkedin.com/pulse/interfaces-javascript-es6-alexey-savchenko-h825f/
const { AbstractCommand } = require('./abstract_command.js')

class NewFileCmd extends AbstractCommand {
	static #Key = Symbol();
	static #Singleton = new NewFileCmd( this.#Key );
	static #InstanceCount = 0;
	
	static #DataUrl_1Pixel = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==';

    // ** Private constructor **
	constructor( key ) {
		super();
		if ( key !== NewFileCmd.#Key ) {
			throw new TypeError("'NewFileCmd' constructor is private");
		}
        this._name = "NewFile";
		this._description = "New File";
	} // ** Private constructor ** 'Singleton' design pattern
	
	async run( args ) {
		konsola.warn('> NewFileCmd.run()');
		let run_result = await super.run(args); 
		if (! run_result) {		
			let main_window = this.electron_main.getMainWindow();
			
			let placeholder = L10n.This.getMsg(QRCODE_MSG_PLACEHOLDER_ID);
			
			main_window.webContents.send
				( "fromMain", [ FromMain_DOM_SET_NODE_ATTRIBUTE, QRCODE_MSG_ID, 'value', '' ] );		

			main_window.webContents.send
				( "fromMain", [ FromMain_DOM_SET_NODE_ATTRIBUTE, QRCODE_MSG_ID, 'placeholder', placeholder ] );			
			
			main_window.webContents.send
				( "fromMain", [ FromMain_DOM_SET_NODE_ATTRIBUTE, QRCODE_IMG_ID, 'src', NewFileCmd.#DataUrl_1Pixel ] );	
		}
	} // async run()
	
	static get This() {
		if( NewFileCmd.#Singleton == undefined ) {
			this.#Singleton = new NewFileCmd();
			if (this.#InstanceCount > 0) {
				throw new TypeError("'NewFileCmd' constructor called more than once");
			}
			this.#InstanceCount++;
        }
        return NewFileCmd.#Singleton;
    } // NewFileCmd get This	
} // NewFileCmd class

// https://stackoverflow.com/questions/10914751/loading-node-js-modules-dynamically-based-on-route/12259975
module.exports = function(module_holder) {
    // the key in this dictionary can be whatever you want just make sure it won't override other modules
	// konsola.log(">> Adding 'NewFileCmd' export_func");
    module_holder['NewFileCmd'] = NewFileCmd.This;
	return module_holder;
};