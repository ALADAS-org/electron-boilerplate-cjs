// =================================================================================================
// =====================================   extension_point.js   ====================================
// =================================================================================================
// https://github.com/dutchigor/pluggable-electron
// https://github.com/dutchigor/pluggable-electron/blob/master/execution/ExtensionPoint.js
"use strict";

const { app } = require('electron');
const { konsola } = require( app.getAppPath() + '/www/src/utils/log/konsola.js');

class ExtensionPoint {	
	constructor(key) {
		this.key = key; /** @type {string} Key of the extension point */
		
		// List of all 'extensions' registered with this extension point
		_extensions = [];
		
		// List of 'callbacks' to be executed when the list of extensions changes
        #change_listeners = [];
	} // constructor
	
	/**
     * Execute (if callback) and return or just return (if object) the response for each extension registered to this extension point.
     * Any asynchronous responses will be executed in parallel and the returned array will contain a promise for each of these responses.
     * @param {*} input Input to be provided as a parameter to each response if response is a callback.
     * @returns {Array} List of responses from the extensions.
     */
	execute(input) {
		return this._extensions.map(p => {
			if (typeof p.response === 'function') {
				return p.response(input);
			} 
			else {
				return p.response;
			}
		})
	} // execute() 
	
	/**
     * Adds new extension with this extension point.
     * The registered response will be executed (if callback) or returned (if object) 
     * when the extension point is executed (see below).
     * @param {string}          'key':      Unique Key for the extension.
     * @param {Object|Callback} 'response':     Object   to be returned  
	 *                                      or  Callback to be called by the extension point.
     * @param {number}          'priority': Order for execution used for executing in serial.
     * @returns {void}
     */
	addExtension(key, response, priority = 0) {
		const index = this._extensions.findIndex(p => p.priority > priority);
		const new_extension = { key, response, priority };
		if (index > -1) {
			this._extensions.splice(index, 0, new_extension);
		} else {
			this._extensions.push(new_extension);
		}

		this.#emitChange();
	} // addExtension()

    /**
     * Remove an extension from the registry. It will no longer be part of the extension point execution.
     * @param {RegExp } 'key': Matcher for the Key of the extension to remove.
     * @returns {void}
     */
	removeExtension(key) {
		const index = this._extensions.findIndex(ext => ext.key.match(key));
		if (index > -1) this._extensions.splice(index, 1);
		this.#emitChange();
	} // removeExtension()

    /**
     * Empty the registry of all extensions.
     * @returns {void}
     */
	clear() {
		this._extensions = []
		this.#emitChange()
	} // clear()	
	
	#emitChange() {
		for (const l of this.#change_listeners) {
			l.callback(this);
		}
	} // #emitChange()
	
	/**
     * Adds a 'callback' to be executed if the list of extensions changes.
     * @param {string}   'key':      Key of the listener needed if it is to be removed.
     * @param {Function} 'callback': callback function to trigger on a change.
     */
    addCallback(key, callback) {
		if (typeof callback === 'function') this.#change_listeners.push({ key, callback })
	} // addCallback()

    /**
     * Removes a 'callback' from the extension list changes.
     * @param {string} name The name of the listener to remove.
     */
    removeCallback(key) {
		const index = this.#change_listeners.findIndex(l => l.key === key)
		if (index > -1) this.#change_listeners.splice(index, 1)
	} // removeCallback()
} // ExtensionPoint class

if ( typeof exports === 'object' ) {	
	exports.ExtensionPoint = ExtensionPoint	
} // exports of 'extension_point.js'
