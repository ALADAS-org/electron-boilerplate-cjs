// ======================================================================================
// ===============================   plugin_registry.js   ===============================
// ======================================================================================
"use strict";

// konsola.log("CommandRegistry");
const { app } = require('electron');
const { konsola } = require( app.getAppPath() + '/www/src/utils/log/konsola.js');

const fs   = require('fs');
const path = require('path');

class PluginRegistry {
	static #key = Symbol();
	static #_Singleton = new PluginRegistry( this.#key );
	static #_InstanceCount = 0;
	
	static Initialized = false;

    // ** Private constructor **
	constructor( key ) {
		// konsola.log('>> new PluginRegistry (Singleton)');
		if ( key !== PluginRegistry.#key ) {
			throw new TypeError('PluginRegistry constructor is private.');
		}
		this.plugins = {};
	} // ** Private constructor ** 'Singleton' design pattern
	
	register( key, plugin_object ) {
		konsola.msg('>> PluginRegistry.register() key: ' + key);
		if (! (plugin_object instanceof AbstractPlugin) ) { 
			throw new TypeError("'plugin_object' is not an instance of 'AbstractPlugin'");	
        }	
		
		if (key != "" && key != undefined && key != null) {
			this.plugins[key] = plugin_object;
		}
	} // register()	

	static Init() {
		konsola.msg('> PluginRegistry.Init');
		if (PluginRegistry.Initialized) return;
		
		const get_folders = (path) => {
			return fs.readdirSync(path).filter(function (file) {
			return fs.statSync(path+'/'+file).isDirectory();
			});
		}; // get_folders()
		
		let folders = get_folders(__dirname);
		// konsola.msg("   folders: " + JSON.stringify(folders));
		
		konsola.msg("   userData: " + app.getPath('userData'));
		
		for (let i=0; i < folders.length; i++) {
			let current_folder = folders[i];
			const file_path = __dirname + '/' + current_folder + '/package.json';
		    // konsola.msg('   folder[' + i + ']: ' + current_folder);
			if (fs.existsSync(file_path)) {
				console.log('   folder ' + current_folder + ' contains package.json');
			}
		}
	} // PluginRegistry.Init()
	
	static get This() {
		// konsola.log('>> PluginRegistry get This ' + PluginRegistry.#_Singleton);
		if ( PluginRegistry.#_Singleton == undefined ) {
			konsola.log('** PluginRegistry.#_Singleton undefined **');
			this.#_Singleton = new PluginRegistry();
			if (this.#_InstanceCount > 0) {
				throw new TypeError("'PluginRegistry' constructor called more than once");
			}
			this.#_InstanceCount++;
        }
		PluginRegistry.Init();
        return PluginRegistry.#_Singleton;
    } // PluginRegistry get This
} // PluginRegistry class

PluginRegistry.This;

exports.PluginRegistry = PluginRegistry


