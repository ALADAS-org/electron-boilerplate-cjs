// ===========================================================================================
// ==================================   abstract_action.js   =================================
// ===========================================================================================
// NB: 'Atomic Operation' for client side (Renderer process / Browser)
"use strict";

// https://www.linkedin.com/pulse/interfaces-javascript-es6-alexey-savchenko-h825f/
class AbstractAction {
    constructor() {
        if (this.constructor === AbstractAction) {
            throw new Error("Cannot instantiate 'AbstractAction' abstract class");
        }

		this._name        = '';
    	this._description = '';
    } // constructor 
	
	async setEventHandler() {
    } // async setEventHandler()
	
    async execute(args) {
		// konsola.msg("> AbstractAction.execute");
		return true;
    } // async execute()
	
	get key() {
		return this.constructor.name;
    } // get key()
	
	get name() {
		return this._name;
    } // 'name' getter
	
	set name(value) {
		this._name = value;
    } // 'name' setter
	
	get description() {
		return this._description;
    } // 'name' getter
	
	set description(value) {
		this._description = value;
    } // 'description' setter	
	
	getInformations() {
		let action_info = { 'key': this.constructor.name, 'name': this._name, 'description': this._description };
		return action_info;
    } // getInformations()
} // 'AbstractAction' Abstract class