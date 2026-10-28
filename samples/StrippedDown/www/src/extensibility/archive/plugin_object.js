// ==============================================================================================
// ====================================   plugin_object.js   ====================================
// ==============================================================================================
"use strict";

const { app } = require('electron');
const { konsola } = require( app.getAppPath() + '/www/src/utils/log/konsola.js');

// https://www.linkedin.com/pulse/interfaces-javascript-es6-alexey-savchenko-h825f/
class PluginObject {
    constructor() {
        if (this.constructor === AbstractModel) {
            throw new Error("Cannot instantiate 'PluginObject' abstract class");
        }
		this.name        = 'Plugin Object';
    	this.description = '';
		this.path        = __dirname;
    } // constructor 
	
	get path() {
		return this.path;
    } // get path()
	
	get name() {
		return this.name;
    } // get name()
	
	get description() {
		return this.description;
    } // get description()
} // 'AbstractModel' Abstract class

exports.PluginObject = PluginObject
