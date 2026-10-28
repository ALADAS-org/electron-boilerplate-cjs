// ======================================================================================
// ===============================   action_registry.js   ===============================
// ======================================================================================
// NB: Registry for 'Atomic Operations' (client side / Renderer process / Browser)
"use strict";

class ActionRegistry {
	static #Key = Symbol();
	static #Singleton = new ActionRegistry( this.#Key );
	static #InstanceCount = 0;
	
    // ** Private constructor **
	constructor( key ) {
		// konsola.log('>> new CommandRegistry (Singleton)');
		if ( key !== ActionRegistry.#Key ) {
			throw new TypeError("'ActionRegistry' constructor is private");
		}
		this.actions = {};
	} // ** Private constructor ** 'Singleton' design pattern
	
	register( key, action_obj ) {
		konsola.msg('> ActionRegistry.register() key: ' + key);
		if (! (action_obj instanceof AbstractAction) ) { 
			throw new TypeError("'action_obj' is not an instance of 'AbstractAction'");	
        }	
		
		this.actions[key] = action_obj;
	} // register()
	
	async setEventHandlers() {
		konsola.msg('> ActionRegistry.setEventHandlers()');
		
		// let qrcode_body_node_ = document.getElementById(QRCODE_EDITOR_BODY_ID);
		// konsola.msg("   qrcode_body_node_: " + qrcode_body_node_);		
		
		// let qrcode_img_node = document.getElementById(QRCODE_IMG_ID);
		// konsola.msg("   qrcode_img_node: " + qrcode_img_node);
		
		let action_keys = Object.keys(this.actions);
		// konsola.msg('   action_keys.length: ' + action_keys.length);
		for (let i=0; i < action_keys.length; i++) { 
		    let action_key = action_keys[i];
			konsola.msg('   action_key: ' + action_key);
			let action_obj = this.actions[action_key];
			await action_obj.setEventHandler();
		}
	} // async setEventHandlers()
	
	getAction( key ) {
		// konsola.log('>> ActionRegistry.getCommand() key:' + key);
		if (this.actions[key] != undefined) {
			return this.actions[key];
		}
		return NullAction.This;
	} // getAction()
	
	getKeys() {
		return Object.keys(this.actions);
	} // getKeys()
	
	static get This() {
		// konsola.log('>> ActionRegistry.This() ' + ActionRegistry.#_Singleton);
		if ( ActionRegistry.#Singleton == undefined ) {
			konsola.log('** ActionRegistry.#_Singleton undefined **');
			this.#Singleton = new ActionRegistry();
			if (this.#InstanceCount > 0) {
				throw new TypeError("'ActionRegistry' constructor called more than once");
			}
			this.#InstanceCount++;
        }

        return ActionRegistry.#Singleton;
    } // ActionRegistry get This	
} // ActionRegistry class