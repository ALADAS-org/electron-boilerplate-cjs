// ======================================================================================
// ================================   open_file_cmd.js   ================================
// ======================================================================================
// https://blog.logrocket.com/create-read-qr-codes-node-js/
"use strict";

const { app, dialog } = require('electron');
const { konsola } = require( app.getAppPath() + '/www/src/utils/log/konsola.js');

const fs = require('fs');

const { Jimp }          = require('jimp');
// const QrCodeReader      = require('qrcode-reader');
const { QrcodeDecoder } = require('qrcode-decoder');

const { AppModel } = require(app.getAppPath() + '/www/src/model/app_model.js');

// https://www.linkedin.com/pulse/interfaces-javascript-es6-alexey-savchenko-h825f/
const { AbstractCommand } = require('./abstract_command.js');

const { FromMain_CALL_ACTION, FromMain_DOM_SET_NODE_ATTRIBUTE, 
		FromMain_DOM_DISPATCH_EVENT, DOM_EVT_UPDATE_QRCODE_TEXT  
	  } = require(app.getAppPath() + '/www/src/const_events.js');
	  
const { QRCODE_IMG_ID, QRCODE_MSG_ID
	  } = require(app.getAppPath() + '/www/src/view/const_view.js');

class OpenFileCmd extends AbstractCommand {
	static #Key = Symbol();
	static #Singleton = new OpenFileCmd( this.#Key );
	static #InstanceCount = 0;
	
	// static #DataUrl = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHQAAAB0CAYAAABUmhYnAAAAAklEQVR4AewaftIAAAKsSURBVO3BQW7kQAwEwSxC//9yro88NSBIM2sTjIg/WGMUa5RijVKsUYo1SrFGKdYoxRqlWKMUa5RijVKsUYo1SrFGKdYoxRrl4qEkfJNKl4QTlS4JncpJEr5J5YlijVKsUYo1ysXLVN6UhDtUuiS8SeVNSXhTsUYp1ijFGuXiw5Jwh8oTSehUuiS8KQl3qHxSsUYp1ijFGuXij1M5ScJJEjqVv6xYoxRrlGKNcvHHJeFE5SQJkxRrlGKNUqxRLj5M5ZNU7kjCm1R+k2KNUqxRijXKxcuS8E1J6FS6JHQqXRLuSMJvVqxRijVKsUaJPxgkCZ1Kl4QTlb+sWKMUa5RijXLxUBI6lZMk/E8qXRK6JHQqJ0noVLok3KHyRLFGKdYoxRrl4j9TeSIJncoTKl0STlTuUPmkYo1SrFGKNcrFQypdEt6UhCeS0Kl0KneonCThjiR0Kk8Ua5RijVKsUeIPXpSEE5WTJHQqJ0l4QqVLQqdykoROpUvCicqbijVKsUYp1igXH6bSJeFEpUtCp9KpdEk4UXkiCSdJ6FS6JHxSsUYp1ijFGiX+4A9LQqdyRxI6lTuS0Kl0SbhD5YlijVKsUYo1ysVDSfgmlZMknKjckYQ7knCi8knFGqVYoxRrlIuXqbwpCU+odEk4ScI3JaFTeaJYoxRrlGKNcvFhSbhD5X9SOUlCp9IloVPpktCpvKlYoxRrlGKNcjGMSpeEE5UuCScqJyonKp9UrFGKNUqxRrn441S6JNyRhBOVkyR0Kl0S7lB5olijFGuUYo1y8WEq36TSJeEOlS4JnUqn8psUa5RijVKsUS5eloRvSkKn0qm8KQknKp3KNxVrlGKNUqxR4g/WGMUapVijFGuUYo1SrFGKNUqxRinWKMUapVijFGuUYo1SrFGKNUqxRvkHv7QE9MppxbsAAAAASUVORK5CYII=";
    static #DataUrl = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHQAAAB0CAYAAABUmhYnAAAAAklEQVR4AewaftIAAAKsSURBVO3BQW7kQAwEwSxC//9yro88NSBIM2sTjIg/WGMUa5RijVKsUYo1SrFGKdYoxRqlWKMUa5RijVKsUYo1SrFGKdYoxRrl4qEkfJNKl4QTlS4JncpJEr5J5YlijVKsUYo1ysXLVN6UhDtUuiS8SeVNSXhTsUYp1ijFGuXiw5Jwh8oTSehUuiS8KQl3qHxSsUYp1ijFGuXij1M5ScJJEjqVv6xYoxRrlGKNcvHHJeFE5SQJkxRrlGKNUqxRLj5M5ZNU7kjCm1R+k2KNUqxRijXKxcuS8E1J6FS6JHQqXRLuSMJvVqxRijVKsUaJPxgkCZ1Kl4QTlb+sWKMUa5RijXLxUBI6lZMk/E8qXRK6JHQqJ0noVLok3KHyRLFGKdYoxRrl4j9TeSIJncoTKl0STlTuUPmkYo1SrFGKNcrFQypdEt6UhCeS0Kl0KneonCThjiR0Kk8Ua5RijVKsUeIPXpSEE5WTJHQqJ0l4QqVLQqdykoROpUvCicqbijVKsUYp1igXH6bSJeFEpUtCp9KpdEk4UXkiCSdJ6FS6JHxSsUYp1ijFGiX+4A9LQqdyRxI6lTuS0Kl0SbhD5YlijVKsUYo1ysVDSfgmlZMknKjckYQ7knCi8knFGqVYoxRrlIuXqbwpCU+odEk4ScI3JaFTeaJYoxRrlGKNcvFhSbhD5X9SOUlCp9IloVPpktCpvKlYoxRrlGKNcjGMSpeEE5UuCScqJyonKp9UrFGKNUqxRrn441S6JNyRhBOVkyR0Kl0S7lB5olijFGuUYo1y8WEq36TSJeEOlS4JnUqn8psUa5RijVKsUS5eloRvSkKn0qm8KQknKp3KNxVrlGKNUqxR4g/WGMUapVijFGuUYo1SrFGKNUqxRinWKMUapVijFGuUYo1SrFGKNUqxRvkHv7QE9MppxbsAAAAASUVORK5CYII=';
    
	// ** Private constructor **
	constructor( key ) {
		super();
		if ( key !== OpenFileCmd.#Key ) {
			throw new TypeError("'OpenFileCmd' constructor is private");
		}
        this._name = "OpenFile";
		this._description = "Open File";
	} // ** Private constructor ** 'Singleton' design pattern
	
	async run( args ) {
		konsola.msg('> OpenFileCmd.run()');
		let run_result = await super.run(args); 
		if (! run_result) {
			let main_window = this.electron_main.getMainWindow();
			
			// Notice: On Windows the '\' separator must be used for paths
			// cf. https://github.com/electron/electron/issues/10421
			let in_path = app.getAppPath() + '\\documents';			
			// konsola.msg('   in_path: ' + in_path);
			
			// let path_exists = fs.existsSync( in_path );
			// konsola.msg('   path_exists: ' + path_exists);
			
			const chosen_file = await dialog.showOpenDialog
				( main_window, {  defaultPath: in_path,
					              filters:     [ { name: 'QRcode', extensions: ['png'] } ],
				                  properties:  ['openFile'] 
				               } 
				);
			
			konsola.msg('   chosen_file: ' + JSON.stringify(chosen_file));	
			
			if (chosen_file == undefined) {
				konsola.warn('   File selection canceled');
				return;
			}
			
			// in_path = app.getAppPath() + '/documents/qrcode_test.png';
			let canceled = chosen_file['canceled'];
			// konsola.msg('   canceled: ' + canceled);
			
			if (canceled == undefined || canceled ) {
				konsola.warn('   File selection canceled');
				return;
			}
			
			let in_filepath = chosen_file['filePaths'][0];
			// konsola.msg('   chosen_file: ' + JSON.stringify(in_filepath));	
			
			let img_buffer = fs.readFileSync(in_filepath);
			
			const img_b64_data = Buffer.from(img_buffer, "binary" ).toString("base64");
			// konsola.msg('   img_b64_data: ' + img_b64_data);
			let img_data_URL = 'data:image/png;base64,' + img_b64_data;
			// konsola.msg('   img_data_URL: ' + img_data_URL);
			
			main_window.webContents.send
				( 'fromMain', [ FromMain_DOM_SET_NODE_ATTRIBUTE, QRCODE_IMG_ID, "src", img_data_URL ] );

			main_window.webContents.send
				( 'fromMain', [ FromMain_CALL_ACTION, 'UpdateQRcodeTextAction', {} ] );				
		}
	} // async OpenFileCmd.run()
	
	static get This() {
		if( OpenFileCmd.#Singleton == undefined ) {
			this.#Singleton = new OpenFileCmd();
			if (this.#InstanceCount > 0) {
				throw new TypeError("'OpenFileCmd' constructor called more than once");
			}
			this.#InstanceCount++;
        }
        return OpenFileCmd.#Singleton;
    } // OpenFileCmd get This	
} // OpenFileCmd class

// https://stackoverflow.com/questions/10914751/loading-node-js-modules-dynamically-based-on-route/12259975
module.exports = function(module_holder) {
    // the key in this dictionary can be whatever you want just make sure it won't override other modules
	// konsola.log(">> Adding 'OpenFileCmd' export_func");
    module_holder['OpenFileCmd'] = OpenFileCmd.This;
	return module_holder;
};