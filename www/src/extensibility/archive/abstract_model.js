// ==============================================================================================
// ====================================   abstract_model.js   ===================================
// ==============================================================================================
"use strict";

const { app } = require('electron');
const { konsola } = require( app.getAppPath() + '/www/src/utils/log/konsola.js');

// https://www.linkedin.com/pulse/interfaces-javascript-es6-alexey-savchenko-h825f/
class AbstractModel {
    constructor() {
        if (this.constructor === AbstractModel) {
            throw new Error("Cannot instantiate 'AbstractModel' abstract class.");
        }
		this.name        = 'Abstract Model';
    	this.description = '';
    } // constructor 
	
	getKey() {
		return this.constructor.name;
    } // getKey()
	
	getName() {
		return this.name;
    } // getName()
	
	getDescription() {
		return this.description;
    } // getDescription()
} // 'AbstractModel' Abstract class

exports.AbstractModel = AbstractModel
