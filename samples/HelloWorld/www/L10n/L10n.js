// ==========================================================================================
// =======================================   L10n.js   ======================================
// ==========================================================================================
// https://github.com/notepad-plus-plus/notepad-plus-plus/tree/aa0be9973ba6cf1c4206952de75655436accbcfa/PowerEditor/installer/nativelang
"use strict";

const { app, BrowserWindow, Menu, ipcMain, globalShortcut } = require('electron');
const path = require('path');
const { konsola } = require( app.getAppPath() + '/www/src/utils/log/konsola.js');

const fs = require('fs');

class L10n {
	static #key = Symbol();
	static #_Singleton = new L10n( this.#key );
	static #_InstanceCount = 0;

    // ** Private constructor **
	constructor( key ) {
		if ( key !== L10n.#key ) {
			throw new TypeError("'L10n' constructor is private");
		}
		// konsola.msg("> new L10n (Singleton)");
        this.name = "L10n";
		
		this.lang = this.getLocale();
		this.available_langs = [];
	} // ** Private constructor ** 'Singleton' design pattern
	
	getMsg( msg_id, lang ) {
		// konsola.log(">> L10n.GetMsg msg_id: " + msg_id);
		// konsola.log(">> msg_id: '" + msg_id + "'");	
		let current_lang = this.lang;
		this.#updateAvailableLangs();
		
		// konsola.msg("  available_langs: " + JSON.stringify(this.available_langs));
		
		if (lang != undefined && this.available_langs.indexOf(lang.toLowerString()) != -1) {
			current_lang = lang;
		}
		
		let L10n_msg = "";
		let filename = "gui-msg-" + current_lang + ".json";
		// konsola.log(">> filename: '" + filename + "'");		
		// konsola.log(">> __dirname: '" + __dirname + "'");
		
		let locale_json_path = __dirname + "/" + filename;
		// konsola.msg(">> locale_json_path: '" + locale_json_path + "'");
		
		let locale_json_str = fs.readFileSync(locale_json_path);
		
		// konsola.log(">> locale_json_str: '" + locale_json_str + "'");	
		if ( locale_json_str == undefined ) {
			L10n_msg = msg_id; 
		}	
		else {
			let json_data = JSON.parse( locale_json_str );
			if ( json_data[msg_id] != undefined ) 	L10n_msg = json_data[msg_id];
		    else                                    L10n_msg = msg_id;	
			//konsola.msg("   L10n_msg['" + msg_id + "'] = " + i18n_msg);
		}
		return L10n_msg;
	} // getMsg()
	
	getKeyPairs(lang) {
		// konsola.msg(">> ---------- L10n.getKeyPairs ----------");
		// konsola.msg(">> msg_id: '" + msg_id + "'");	
		let L10n_keypairs = {};
		
		let current_lang = this.lang;
		this.#updateAvailableLangs();		
		
		if (lang != undefined && this.available_langs.indexOf(lang.toLowerString()) != -1) {
			current_lang = lang;
		}
		
		//konsola.log("   lang: " + lang);
		let filename  = "gui-msg-" + current_lang + ".json";
		// konsola.log(">> filename: '" + filename + "'");
		
		let locale_json_str = fs.readFileSync(__dirname + "/" + filename);
		if (locale_json_str != undefined) {
			L10n_keypairs = JSON.parse( locale_json_str );
			//konsola.log("   L10n_keys: " + JSON.stringify(L10n_keypairs));
		}
		return L10n_keypairs;
	} // getKeyPairs()

	getLocale() {
		let locale = Intl.DateTimeFormat().resolvedOptions().locale;
		//konsola.log("   GetLocale locale: '" + locale + "'");
		
		let lang = (locale == undefined) ? "en" : locale.substring(0,2);
		//konsola.log("   GetLocale lang: '" + lang + "'");
		return lang;
	} // getLocale()
	
	setLocale(lang) {
		this.#updateAvailableLangs();
		if (this.available_langs.indexOf(lang.toLowerString()) != -1) {
			this.lang = lang;
		}
	} // setLocale()
	
	#updateAvailableLangs() {
		let filenames = fs.readdirSync(__dirname + "/");
		this.available_langs = [];
		for (let i=0; i < filenames.length; i++) {
		// "gui-msg-" + lang + ".json"		
			let filename = filenames[i];
			if (filename.startsWith('gui-msg-') && filename.endsWith('.json')) {
				let lang = filename.replace('gui-msg-','').replace('.json','');
				this.available_langs.push(lang);
			}	
		}
	} // #updateAvailableLangs()
	
	static get This() {
		if( L10n.#_Singleton == undefined ) {
			this.#_Singleton = new L10n();
			if (this.#_InstanceCount > 0) {
				throw new TypeError("'L10n' constructor called more than once");
			}
			this.#_InstanceCount++;
        }
        return L10n.#_Singleton;
    } // L10n get This	
} // L10n class

L10n.This;

const test_GetLocalizedMsg = () => {
	konsola.log(">> ---------- test_L10nUtils.GetLocalizedMsg ----------");
	konsola.log("   Locale: '" + L10n.This.getLocale() + "'");
	const MSG_IDS = [ "File", "Quit" ];
	let L10n_msg = "";
	for (let i=0; i < MSG_IDS.length; i++) {
		let msg_id = MSG_IDS[i];
		L10n_msg = L10n.This.getMsg(msg_id);
		konsola.log("   L10n_msg['" + msg_id + "'] = " + L10n_msg);
	}	
}; // test_GetLocalizedMsg()

//test_GetLocalizedMsg();

exports.L10n = L10n