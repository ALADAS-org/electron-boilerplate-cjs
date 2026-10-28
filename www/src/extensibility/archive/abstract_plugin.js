// =============================================================================================
// ===================================   abstract_plugin.js   ==================================
// =============================================================================================
"use strict";

const { app } = require('electron');
const { konsola } = require( app.getAppPath() + '/www/src/utils/log/konsola.js');

// https://www.linkedin.com/pulse/interfaces-javascript-es6-alexey-savchenko-h825f/
class AbstractPlugin {
    constructor() {
        if (this.constructor === AbstractPlugin) {
            throw new Error("Cannot instantiate 'AbstractPlugin' abstract class.");
        }
		this.name        = '';
    	this.description = '';
    } // constructor 
	
    install(args) {
		konsola.log("> AbstractPlugin.install");
    } // install()
	
	uninstall(args) {
		konsola.log("> AbstractPlugin.uninstall");
    } // uninstall()
	
	getKey() {
		return this.constructor.name;
    } // getKey()
	
	getName() {
		return this.name;
    } // getName()
	
	getDescription() {
		return this.description;
    } // getDescription()
} // 'AbstractPlugin' Abstract class

exports.AbstractPlugin = AbstractPlugin
