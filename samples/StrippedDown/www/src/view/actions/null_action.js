// ==========================================================================================
// ===================================   null_action.js   ===================================
// ==========================================================================================
// NB: 'Atomic Operation' for client side (Renderer process / Browser)
"use strict";

class NullAction extends AbstractAction {
	static #_Key = Symbol();
	static #_Singleton = new NullAction( this.#_Key );
	static #_InstanceCount = 0;

    // ** Private constructor **
	constructor( key ) {
		super();
		// konsola.msg('> new NullAction');
		if ( key !== NullAction.#_Key ) {
			throw new TypeError("'NullAction' constructor is private");
		}
        this.name = "NullAction";
		this.description = "Null Action";
	} // ** Private constructor ** 'Singleton' design pattern
	
	async execute(args) {
		// konsola.warn('> NullAction.execute()');		
	} // async execute()
	
	static get This() {
		if( NullAction.#_Singleton == undefined ) {
			this.#_Singleton = new NullAction();
			if (this.#_InstanceCount > 0) {
				throw new TypeError("'NullAction' constructor called more than once");
			}
			this.#_InstanceCount++;
        }
        return NullAction.#_Singleton;
    } // NullAction get This	
} // NullAction class

NullAction.This;