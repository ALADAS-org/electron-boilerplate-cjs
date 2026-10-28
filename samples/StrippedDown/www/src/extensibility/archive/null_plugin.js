// ========================================================================================
// =================================   null_plugin.js   ===================================
// ========================================================================================
"use strict";

const { app } = require('electron');
const { konsola } = require( app.getAppPath() + '/www/src/utils/log/konsola.js');

// https://www.linkedin.com/pulse/interfaces-javascript-es6-alexey-savchenko-h825f/
const { AbstractPlugin } = require( './abstract_plugin.js');

class NullPlugin extends AbstractPlugin {
	static #key = Symbol();
	static #_Singleton = new NullPlugin( this.#key );
	static #_InstanceCount = 0;

    // ** Private constructor **
	constructor( key ) {
		super();
		if ( key !== NullPlugin.#key ) {
			throw new TypeError('NullPlugin constructor is private.');
		}
		// konsola.msg("> new NullPlugin (Singleton)");
        this.name = "Null Plugin";
	} // ** Private constructor ** 'Singleton' design pattern
	
	install( electron_main ) {
		konsola.msg('>> NullPlugin.install()');
	} // NullCmd.install()
	
	uninstall( electron_main ) {
		konsola.msg('>> NullPlugin.uninstall()');
	} // NullCmd.uninstall()
	
	static get This() {
		if( NullPlugin.#_Singleton == undefined ) {
			this.#_Singleton = new NullPlugin();
			if (this.#_InstanceCount > 0) {
				throw new TypeError("NullCmd constructor called more than once.");
			}
			this.#_InstanceCount++;
        }
        return NullPlugin.#_Singleton;
    } // NullPlugin get This	
} // NullPlugin class

NullPlugin.This; // NB: only required by 'NullPlugin' class

if ( typeof exports === 'object' ) {	
	exports.NullPlugin = NullPlugin	
} // exports of 'null_p.js'