// =======================================================================================
// ===============================   save_file_as_cmd.js   ===============================
// =======================================================================================
"use strict";

const { app, dialog } = require('electron');
const fs      = require('fs');

const QRCode  = require('qrcode');
const base64  = require('base-64');

const { konsola }  = require( app.getAppPath() + '/www/src/utils/log/konsola.js');

const { AppModel } = require( app.getAppPath() + '/www/src/model/app_model.js');

const { DOCUMENT_DEFAULT_BASENAME_KEY, DOCUMENT_COUNT_KEY, IMG_DATA_URL_KEY
	  } = require(app.getAppPath() + '/www/src/model/const_model_keys.js');

const { FromMain_DOM_GET_NODE_ATTRIBUTE
	  } = require(app.getAppPath() + '/www/src/const_events.js');
	  
const { QRCODE_IMG_ID
	  } = require(app.getAppPath() + '/www/src/view/const_view.js');

// https://www.linkedin.com/pulse/interfaces-javascript-es6-alexey-savchenko-h825f/
const { AbstractCommand } = require('./abstract_command.js');

class SaveFileAsCmd extends AbstractCommand {
	static #Key = Symbol();
	static #Singleton = new SaveFileAsCmd( this.#Key );
	static #InstanceCount = 0;
	
    // ** Private constructor **
	constructor( key ) {
		super();
		if ( key !== SaveFileAsCmd.#Key ) {
			throw new TypeError("'SaveFileAsCmd' constructor is private");
		}
        this._name = "SaveFileAs";
		this._description = "Save File As...";
	} // ** Private constructor ** 'Singleton' design pattern
	
	// https://gist.github.com/akirattii/a0c4ac2a1ae5d95c765d44c0f0be4d0e
	saveAsImgFile(data_url, out_filepath) {
		konsola.msg('> saveAsImgFile()'); // \n' +  data_url);
		const regex   = /^data:.+\/(.+);base64,(.*)$/;
		const matches = data_url.match(regex);
		const ext     = matches[1];
		const data    = matches[2];
		// console.log(data);
		const buffer  = Buffer.from(data, 'base64');
		fs.writeFileSync(out_filepath, buffer);
	} // saveAsImgFile()
	
	async run( args ) {
		konsola.msg('> SaveFileAsCmd.run()');
		let run_result = await super.run(args); 
		if (! run_result) {			
			let img_data_URL = AppModel.This.getValue(IMG_DATA_URL_KEY);
			
			// Notice: On Windows the '\' separator must be used for paths
			// cf. https://github.com/electron/electron/issues/10421
			let out_path = app.getAppPath() + '\\documents';	
			// let chosen_filename = dialog.showSaveDialog( { defaultPath: out_path } );
			
			try {
				let result = await dialog.showSaveDialog
								   ( { defaultPath: out_path,
                                       filters: [ { name: 'QRcode', extensions: ['png'] } ]
									 } );

				konsola.msg('Save resolved:' + JSON.stringify(result));
				let canceled  = result['canceled'];
				if (canceled) {
					konsola.warn("   'File Save as...' canceled");
					return;
				}
				
				let file_path = result['filePath'];
				// const { filePath } = chosen_filename;
				// konsola.msg('filePath -->' +  filePath);
				
				this.saveAsImgFile(img_data_URL, file_path);
			} catch (e) {
				konsola.msg('Save failed:', e)
			}            
		}
	} // async run()
	
	static get This() {
		if( SaveFileAsCmd.#Singleton == undefined ) {
			this.#Singleton = new SaveFileCmd();
			if (this.#InstanceCount > 0) {
				throw new TypeError("'SaveFileAsCmd' constructor called more than once");
			}
			this.#InstanceCount++;
        }
        return SaveFileAsCmd.#Singleton;
    } // SaveFileAsCmd get This	
} // SaveFileAsCmd class

// https://stackoverflow.com/questions/10914751/loading-node-js-modules-dynamically-based-on-route/12259975
module.exports = function(module_holder) {
    // the key in this dictionary can be whatever you want just make sure it won't override other modules
	// konsola.log(">> Adding 'SaveFileAsCmd' export_func");
    module_holder['SaveFileAsCmd'] = SaveFileAsCmd.This;
	return module_holder;
};