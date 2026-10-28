// =============================================================================================
// =====================================    base_value.js   ====================================
// =============================================================================================
"use strict";

const { app } = require('electron');
const { konsola } = require( app.getAppPath() + '/www/src/utils/log/konsola.js');

// https://www.linkedin.com/pulse/interfaces-javascript-es6-alexey-savchenko-h825f/
class BaseValue {
    constructor(data) {
		// konsola.msg('> new BaseValue');
		this.name = "Base Value";
		
		let dummy = {};
				
		if (data != undefined && data != null) {
			this.type  = typeof data;
			// konsola.msg('   this._data ' + data.constructor.name);
			this._data = data;
		}
        else {
			this.type  = typeof dummy;
			this._data = {};
		}	
    } // constructor 
	
	get data() {
		return this._data;
    } // get value
	
	set data(data) {
		// konsola.msg('   set data ' + typeof data);
		this._data = data;
    } // set value
} // 'BaseValue' Base class for 'typed Value' classes

exports.BaseValue = BaseValue
