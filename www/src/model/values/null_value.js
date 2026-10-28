// =====================================================================================
// ================================   null_value.js   ==================================
// =====================================================================================
"use strict";

const { app } = require('electron');
const { konsola } = require( app.getAppPath() + '/www/src/utils/log/konsola.js');
konsola.resetLevel();

// https://www.linkedin.com/pulse/interfaces-javascript-es6-alexey-savchenko-h825f/
const { BaseValue } = require( './base_value.js');

class NullValue extends BaseValue {
	static #key = Symbol();
	static #_Singleton = new NullValue( this.#key );
	static #_InstanceCount = 0;

    // ** Private constructor **
	constructor( key ) {
		super();
		if ( key !== NullValue.#key ) {
			throw new TypeError('NullValue constructor is private.');
		}
		// konsola.msg("> new NullValue (Singleton)");
        this.name = "Null Value";
		this._data = "*None*";
	} // ** Private constructor ** 'Singleton' design pattern
	
	set data(new_data) {
		throw new TypeError("Cannot set value of 'NullValue'");
    } // set data
	
	static get This() {
		if( NullValue.#_Singleton == undefined ) {
			this.#_Singleton = new NullValue();
			if (this.#_InstanceCount > 0) {
				throw new TypeError("NullValue constructor called more than once.");
			}
			this.#_InstanceCount++;
        }
        return NullValue.#_Singleton;
    } // NullValue get This	
} // NullValue class

NullValue.This; // NB: only required by 'NullValue' class

if ( typeof exports === 'object' ) {	
	exports.NullValue = NullValue	
} // exports of 'null_value.js'