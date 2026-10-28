// ===========================================================================================
// ==================================   document_factory.js   ================================
// ===========================================================================================
"use strict";

const { app } = require('electron');
const { konsola } = require( app.getAppPath() + '/www/src/utils/log/konsola.js');

class DocumentFactory {
	static #_Key = Symbol();
	static #_Singleton = new DocumentFactory( this.#_Key );
	static #_InstanceCount = 0;

    // ** Private constructor **
	constructor( key ) {
		// konsola.log('>> new DocumentFactory (Singleton)');
		if ( key !== DocumentFactory.#_Key ) {
			throw new TypeError('DocumentFactory constructor is private.');
		}
		this.attributes = {};
	} // ** Private constructor ** 'Singleton' design pattern
	
	static get This() {
		// konsola.log('>> DocumentFactory.This() ' + DocumentFactory.#_Singleton);
		if ( DocumentFactory.#_Singleton == undefined ) {
			this.#_Singleton = new DocumentFactory();
			if (this.#_InstanceCount > 0) {
				throw new TypeError("'DocumentFactory' constructor called more than once");
			}
			this.#_InstanceCount++;
        }

        return DocumentFactory.#_Singleton;
    } // get This	
} // DocumentFactory class

DocumentFactory.This;

exports.DocumentFactory = DocumentFactory