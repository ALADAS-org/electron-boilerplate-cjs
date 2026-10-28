// =========================================================================================
// ===========================   toggle_command_palette_cmd.js   ===========================
// =========================================================================================
"use strict";

const { app } = require('electron');
const { konsola } = require( app.getAppPath() + '/www/src/utils/log/konsola.js');

const {  FromMain_DOM_SET_NODE_VISIBILITY
	  } = require(app.getAppPath() + '/www/src/const_events.js');
	
const { COMMAND_PALETTE_SLOT, COMMAND_PALETTE_CONTENT_ID
	  } = require(app.getAppPath() + '/www/src/view/const_view.js');	  

// https://www.linkedin.com/pulse/interfaces-javascript-es6-alexey-savchenko-h825f/
const { AbstractCommand } = require('./abstract_command.js')

class ToggleCommandPaletteCmd extends AbstractCommand {
	static #Key = Symbol();
	static #Singleton = new ToggleCommandPaletteCmd( this.#Key );
	static #InstanceCount = 0;

    // ** Private constructor **
	constructor( key ) {
		super();
		if ( key !== ToggleCommandPaletteCmd.#Key ) {
			throw new TypeError("'ToggleCommandPaletteCmd' constructor is private");
		}
        this._name = "ToggleCommandPalette";
		this._description = "Toggle Command Palette";
	} // ** Private constructor ** 'Singleton' design pattern
	
	// fill UL List
	// https://stackoverflow.com/questions/11128700/create-a-ul-and-fill-it-based-on-a-passed-array
	
	async run( args ) {
		// konsola.msg('-> ToggleCommandPaletteCmd.run()');
		let run_result = await super.run(args); 
		if (! run_result) {
			let main_window = this.electron_main.getMainWindow();
			// konsola.msg('   main_window: ' + main_window.constructor.name);

			await main_window.webContents.send
				("fromMain", [FromMain_DOM_SET_NODE_VISIBILITY, COMMAND_PALETTE_SLOT, true]);
		}
	} // async run()
	
	static get This() {
		if( ToggleCommandPaletteCmd.#Singleton == undefined ) {
			this.#Singleton = new ToggleCommandPaletteCmd();
			if (this.#InstanceCount > 0) {
				throw new TypeError("'ToggleCommandPanelCmd' constructor called more than once");
			}
			this.#InstanceCount++;
        }
        return ToggleCommandPaletteCmd.#Singleton;
    } // ToggleCommandPaletteCmd get This	
} // ToggleCommandPaletteCmd class

// https://stackoverflow.com/questions/10914751/loading-node-js-modules-dynamically-based-on-route/12259975
module.exports = function(module_holder) {
    // the key in this dictionary can be whatever you want just make sure it won't override other modules
	// konsola.log(">> Adding 'ToggleCommandPaletteCmd' export_func");
	module_holder['ToggleCommandPaletteCmd'] = ToggleCommandPaletteCmd.This;
	return module_holder;
};