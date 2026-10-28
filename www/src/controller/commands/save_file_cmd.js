// ======================================================================================
// ================================   save_file_cmd.js   ================================
// ======================================================================================
"use strict";

const { app } = require('electron');
const { konsola }  = require( app.getAppPath() + '/www/src/utils/log/konsola.js');

const fs      = require('fs');
const base64  = require('base-64');

const { AppModel } = require( app.getAppPath() + '/www/src/model/app_model.js');

const { DOCUMENT_DEFAULT_BASENAME_KEY, DOCUMENT_COUNT_KEY, IMG_DATA_URL_KEY
	  } = require(app.getAppPath() + '/www/src/model/const_model_keys.js');

const { FromMain_DOM_GET_NODE_ATTRIBUTE
	  } = require(app.getAppPath() + '/www/src/const_events.js');
	  
const { QRCODE_IMG_ID
	  } = require(app.getAppPath() + '/www/src/view/const_view.js');

// https://www.linkedin.com/pulse/interfaces-javascript-es6-alexey-savchenko-h825f/
const { AbstractCommand } = require('./abstract_command.js');

class SaveFileCmd extends AbstractCommand {
	static #Key = Symbol();
	static #Singleton = new SaveFileCmd( this.#Key );
	static #InstanceCount = 0;
	
	static #DataUrl_1Pixel = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==';

    // ** Private constructor **
	constructor( key ) {
		super();
		if ( key !== SaveFileCmd.#Key ) {
			throw new TypeError("'SaveFileCmd' constructor is private");
		}
        this._name = "SaveFile";
		this._description = "Save File";
	} // ** Private constructor ** 'Singleton' design pattern
	
	// https://gist.github.com/akirattii/a0c4ac2a1ae5d95c765d44c0f0be4d0e
	saveAsImgFile(data_url, out_filename) {
		konsola.msg('> SaveFileCmd.This.saveAsImgFile()'); // + data_url);
		if (data_url == undefined) {
			konsola.warn('> *ERROR* in SaveFileCmd.This.saveAsImgFile():  data_url is UNDEFINED');
			return;
		}
		const regex   = /^data:.+\/(.+);base64,(.*)$/;
		const matches = data_url.match(regex);
		const ext     = matches[1];
		const data    = matches[2];
		// console.log(data);
		const buffer  = Buffer.from(data, 'base64');
		const out_path = app.getAppPath() + '/documents/' + out_filename + '.' + ext;
		fs.writeFileSync(out_path, buffer);
	} // saveAsImgFile()
	
	async run( args ) {
		konsola.warn('> SaveFileCmd.run()');
		let run_result = await super.run(args); 
		if (! run_result) {			
			let img_data_URL = AppModel.This.getValue(IMG_DATA_URL_KEY);			
			let doc_basename = AppModel.This.getValue(DOCUMENT_DEFAULT_BASENAME_KEY);
		    let doc_count    = AppModel.This.getValue(DOCUMENT_COUNT_KEY);
		
            this.saveAsImgFile(img_data_URL, doc_basename + '_' + doc_count++);
			konsola.msg('   doc_count: ' + doc_count);
			AppModel.This.setValue(DOCUMENT_COUNT_KEY, doc_count);
		}
	} // async run()
	
	static get This() {
		if( SaveFileCmd.#Singleton == undefined ) {
			this.#Singleton = new SaveFileCmd();
			if (this.#InstanceCount > 0) {
				throw new TypeError("'SaveFileCmd' constructor called more than once");
			}
			this.#InstanceCount++;
        }
        return SaveFileCmd.#Singleton;
    } // SaveFileCmd get This	
} // SaveFileCmd class

// https://stackoverflow.com/questions/10914751/loading-node-js-modules-dynamically-based-on-route/12259975
module.exports = function(module_holder) {
    // the key in this dictionary can be whatever you want just make sure it won't override other modules
	// konsola.log(">> Adding 'SaveFileCmd' export_func");
    module_holder['SaveFileCmd'] = SaveFileCmd.This;
	return module_holder;
};