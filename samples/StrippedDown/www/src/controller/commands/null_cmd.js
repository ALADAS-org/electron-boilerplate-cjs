// =====================================================================================
// =================================   null_cmd.js   ===================================
// =====================================================================================
"use strict";

const { app } = require('electron');
const { konsola } = require( app.getAppPath() + '/www/src/utils/log/konsola.js');
konsola.resetLevel();

// https://www.linkedin.com/pulse/interfaces-javascript-es6-alexey-savchenko-h825f/
const { AbstractCommand } = require( './abstract_command.js');

class NullCmd extends AbstractCommand {
	static #Key = Symbol();
	static #Singleton = new NullCmd( this.#Key );
	static #InstanceCount = 0;

    // ** Private constructor **
	constructor( key ) {
		super();
		if ( key !== NullCmd.#Key ) {
			throw new TypeError("'NullCmd' constructor is private");
		}
		// konsola.msg("> new NullCmd (Singleton)");
        this._name = "NullCmd";
	} // ** Private constructor ** 'Singleton' design pattern
	
	async run( args ) {
		konsola.msg('>> NullCmd.run()');
	} // async run()
	
	static get This() {
		if( NullCmd.#Singleton == undefined ) {
			this.#Singleton = new NullCmd();
			if (this.#InstanceCount > 0) {
				throw new TypeError("'NullCmd' constructor called more than once");
			}
			this.#InstanceCount++;
        }
        return NullCmd.#Singleton;
    } // NullCmd get This	
} // NullCmd class

NullCmd.This; // NB: only required by 'NullCmd' class

if ( typeof exports === 'object' ) {	
	exports.NullCmd = NullCmd	
} // exports of 'null_cmd.js'