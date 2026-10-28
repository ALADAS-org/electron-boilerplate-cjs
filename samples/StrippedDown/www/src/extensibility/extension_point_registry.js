// ==================================================================================================
// =================================   extension_point_registry.js   ================================
// ==================================================================================================
// https://github.com/dutchigor/pluggable-electron
// https://github.com/dutchigor/pluggable-electron/blob/master/execution/ExtensionPoint.js
"use strict";

const { app } = require('electron');
const { konsola } = require( app.getAppPath() + '/www/src/utils/log/konsola.js');

const { ExtensionPoint } = require( app.getAppPath() + '/www/src/extensibility/extension_point.js');

class ExtensionPointRegistry {
	static #_SingletonKey = Symbol();
	static #_Singleton = new ExtensionPointRegistry( this.#_SingletonKey );
	static #_InstanceCount = 0;

    // ** Private constructor **
	constructor( key ) {
		if ( key !== ExtensionPointRegistry.#_SingletonKey ) {
			throw new TypeError("'ExtensionPointRegistry' constructor is private");
		}
		// konsola.msg("> new ExtensionPoint (Singleton)");
        this.name = "Extension Point Registry";
		
		// The list of all extensions registered with this extension point.
		this._extension_points = {}; 
	} // ** Private constructor ** 'Singleton' design pattern
	
	add(key, response, priority=0) {
		let extension_point = new ExtensionPoint(key, response, priority);
		this._extension_points[key] = extension_point;
	} // add()
	
	execute(key) {
		let extension_point = this._extension_points[key];
		if (extension_point != undefined) { 
			extension_point.execute();
		}
	} // add()
	
	static get This() {
		if( ExtensionPointRegistry.#_Singleton == undefined ) {
			this.#_Singleton = new ExtensionPointRegistry();
			if (this.#_InstanceCount > 0) {
				throw new TypeError("'ExtensionPointRegistry' constructor called more than once");
			}
			this.#_InstanceCount++;
        }
        return ExtensionPointRegistry.#_Singleton;
    } // ExtensionPointRegistry get This	
} // ExtensionPointRegistry class

ExtensionPointRegistry.This;

if ( typeof exports === 'object' ) {	
	exports.ExtensionPointRegistry = ExtensionPointRegistry	
} // exports of 'extension_point_registry.js'
