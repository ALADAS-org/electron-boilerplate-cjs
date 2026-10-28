// ======================================================================================
// ==================================   app_model.js   ==================================
// ======================================================================================
"use strict";

const { app } = require('electron');
const { konsola } = require( app.getAppPath() + '/www/src/utils/log/konsola.js');

const { BaseValue } = require( app.getAppPath() + '/www/src/model/values/base_value.js');
const { NullValue } = require( app.getAppPath() + '/www/src/model/values/null_value.js');

class AppModel {
	static #key = Symbol();
	static #_Singleton = new AppModel( this.#key );
	static #_InstanceCount = 0;

    // ** Private constructor **
	constructor( key ) {
		// konsola.log('>> new AppModel (Singleton)');
		if ( key !== AppModel.#key ) {
			throw new TypeError('AppModel constructor is private.');
		}
		this.attributes = {};
	} // ** Private constructor ** 'Singleton' design pattern
	
	setValue(key, new_data) {
		// konsola.msg('> AppModel.setValue() key: ' + key);
		if (key != "" && key != undefined && key != null) {			
			let value_obj = new BaseValue(new_data); 
			this.attributes[key] = value_obj;
		}
	} // setValue()
	
	getValue( key ) {
		// konsola.msg('> AppModel.getValue() key: ' + key);
		// konsola.log('   ' + JSON.stringify(this.attributes));
		if (this.attributes[key] != undefined) {
			return this.attributes[key].data;
		}
		return NullValue.This.data;
	} // getValue()
	
	static get This() {
		// konsola.log('>> CommandRegistry.This() ' + CommandRegistry.#_Singleton);
		if ( AppModel.#_Singleton == undefined ) {
			konsola.log('** AppModel.#_Singleton undefined **');
			this.#_Singleton = new AppModel();
			if (this.#_InstanceCount > 0) {
				throw new TypeError("'AppModel' constructor called more than once");
			}
			this.#_InstanceCount++;
        }

        return AppModel.#_Singleton;
    } // get This	
} // AppModel class

AppModel.This;

exports.AppModel = AppModel


