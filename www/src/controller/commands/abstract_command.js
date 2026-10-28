// ============================================================================================
// ==================================   abstract_command.js   =================================
// ============================================================================================
"use strict";

const { app } = require('electron');
const { konsola } = require( app.getAppPath() + '/www/src/utils/log/konsola.js');

// https://www.linkedin.com/pulse/interfaces-javascript-es6-alexey-savchenko-h825f/
class AbstractCommand {
    constructor() {
        if (this.constructor === AbstractCommand) {
            throw new Error("Cannot instantiate 'AbstractCommand' abstract class.");
        }
		
		this.electron_main  = undefined;
		this.delegate       = undefined;
		this._name          = '';
    	this._description   = '';
    } // constructor 
	
	setElectronMain( electron_main ) {
		// konsola.info('> AbstractCommand.setElectronMain() electron_main: ' + electron_main);
		this.electron_main = electron_main; 
	} // setElectronMain()
	
	// Delegate Design Pattern
	// https://stackoverflow.com/questions/18939192/how-to-test-if-b-is-a-subclass-of-a-in-javascript-node
	setDelegate( delegate_object ) {
		konsola.info('--> AbstractCommand.setDelegate() typeof ' + typeof delegate_object);
		if (delegate_object !== undefined  &&  delegate_object instanceof AbstractCommand) {
			konsola.info('--> AbstractCommand.setDelegate() 1')
			this.delegate = delegate_object;
		}
		else if (delegate_object == undefined) {
			throw new TypeError("'delegate_object' is undefined'");
		}
        else {	
			throw new TypeError("'delegate_object' is not an instance of 'AbstractCommand'");		
		}
	} // setDelegate()

    async run(args) {
		// konsola.log("> AbstractCommand.run this.delegate: " + this.delegate);
		if (this.delegate == undefined) {
			return false;
		}
		else {
			await this.delegate.run(args);
		}	
		return true;
    } // async run()
	
	get key() {
		return this.constructor.name;
    } // 'key' getter
	
	get name() {
		return this._name;
    } // 'name' getter
	
	set name(value) {
		this._name = value;
    } // 'name' getter
	
	get description() {
		return this._description;
    } // 'description' getter
	
	set description(value) {
		this._description = value;
    } // 'description' setter
	
	getInformations() {
		let cmd_info = { 'key': this.constructor.name, 'name': this._name, 'description': this._description };
		return cmd_info;
    } // getInformations()
} // 'AbstractCommand' Abstract class

exports.AbstractCommand = AbstractCommand
