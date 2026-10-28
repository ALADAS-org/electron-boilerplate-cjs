// =======================================================================================
// =============================   generate_doc_cmd_cmd.js   =============================
// =======================================================================================
"use strict";

const { app } = require('electron');
const { konsola } = require( app.getAppPath() + '/www/src/utils/log/konsola.js');

const QRCode = require('qrcode')

const { LoremIpsum } = require(app.getAppPath() + '/www/src/utils/text_generator/lorem_ipsum.js');

// https://www.linkedin.com/pulse/interfaces-javascript-es6-alexey-savchenko-h825f/
const { AbstractCommand } = require('./abstract_command.js');

const { FromMain_DOM_SET_NODE_ATTRIBUTE
	  } = require(app.getAppPath() + '/www/src/const_events.js');
	  
const { AppModel } = require(app.getAppPath() + '/www/src/model/app_model.js'); 

const { IMG_DATA_URL_KEY
	  } = require(app.getAppPath() + '/www/src/model/const_model_keys.js');  
	  
const { QRCODE_MSG_ID, QRCODE_IMG_ID
	  } = require(app.getAppPath() + '/www/src/view/const_view.js');

class GenerateDocCmd extends AbstractCommand {
	static #Key = Symbol();
	static #Singleton = new GenerateDocCmd( this.#Key );
	static #InstanceCount = 0;
	
	// static #DataUrl = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHQAAAB0CAYAAABUmhYnAAAAAklEQVR4AewaftIAAAKsSURBVO3BQW7kQAwEwSxC//9yro88NSBIM2sTjIg/WGMUa5RijVKsUYo1SrFGKdYoxRqlWKMUa5RijVKsUYo1SrFGKdYoxRrl4qEkfJNKl4QTlS4JncpJEr5J5YlijVKsUYo1ysXLVN6UhDtUuiS8SeVNSXhTsUYp1ijFGuXiw5Jwh8oTSehUuiS8KQl3qHxSsUYp1ijFGuXij1M5ScJJEjqVv6xYoxRrlGKNcvHHJeFE5SQJkxRrlGKNUqxRLj5M5ZNU7kjCm1R+k2KNUqxRijXKxcuS8E1J6FS6JHQqXRLuSMJvVqxRijVKsUaJPxgkCZ1Kl4QTlb+sWKMUa5RijXLxUBI6lZMk/E8qXRK6JHQqJ0noVLok3KHyRLFGKdYoxRrl4j9TeSIJncoTKl0STlTuUPmkYo1SrFGKNcrFQypdEt6UhCeS0Kl0KneonCThjiR0Kk8Ua5RijVKsUeIPXpSEE5WTJHQqJ0l4QqVLQqdykoROpUvCicqbijVKsUYp1igXH6bSJeFEpUtCp9KpdEk4UXkiCSdJ6FS6JHxSsUYp1ijFGiX+4A9LQqdyRxI6lTuS0Kl0SbhD5YlijVKsUYo1ysVDSfgmlZMknKjckYQ7knCi8knFGqVYoxRrlIuXqbwpCU+odEk4ScI3JaFTeaJYoxRrlGKNcvFhSbhD5X9SOUlCp9IloVPpktCpvKlYoxRrlGKNcjGMSpeEE5UuCScqJyonKp9UrFGKNUqxRrn441S6JNyRhBOVkyR0Kl0S7lB5olijFGuUYo1y8WEq36TSJeEOlS4JnUqn8psUa5RijVKsUS5eloRvSkKn0qm8KQknKp3KNxVrlGKNUqxR4g/WGMUapVijFGuUYo1SrFGKNUqxRinWKMUapVijFGuUYo1SrFGKNUqxRvkHv7QE9MppxbsAAAAASUVORK5CYII=";
    static #DataUrl = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHQAAAB0CAYAAABUmhYnAAAAAklEQVR4AewaftIAAAKsSURBVO3BQW7kQAwEwSxC//9yro88NSBIM2sTjIg/WGMUa5RijVKsUYo1SrFGKdYoxRqlWKMUa5RijVKsUYo1SrFGKdYoxRrl4qEkfJNKl4QTlS4JncpJEr5J5YlijVKsUYo1ysXLVN6UhDtUuiS8SeVNSXhTsUYp1ijFGuXiw5Jwh8oTSehUuiS8KQl3qHxSsUYp1ijFGuXij1M5ScJJEjqVv6xYoxRrlGKNcvHHJeFE5SQJkxRrlGKNUqxRLj5M5ZNU7kjCm1R+k2KNUqxRijXKxcuS8E1J6FS6JHQqXRLuSMJvVqxRijVKsUaJPxgkCZ1Kl4QTlb+sWKMUa5RijXLxUBI6lZMk/E8qXRK6JHQqJ0noVLok3KHyRLFGKdYoxRrl4j9TeSIJncoTKl0STlTuUPmkYo1SrFGKNcrFQypdEt6UhCeS0Kl0KneonCThjiR0Kk8Ua5RijVKsUeIPXpSEE5WTJHQqJ0l4QqVLQqdykoROpUvCicqbijVKsUYp1igXH6bSJeFEpUtCp9KpdEk4UXkiCSdJ6FS6JHxSsUYp1ijFGiX+4A9LQqdyRxI6lTuS0Kl0SbhD5YlijVKsUYo1ysVDSfgmlZMknKjckYQ7knCi8knFGqVYoxRrlIuXqbwpCU+odEk4ScI3JaFTeaJYoxRrlGKNcvFhSbhD5X9SOUlCp9IloVPpktCpvKlYoxRrlGKNcjGMSpeEE5UuCScqJyonKp9UrFGKNUqxRrn441S6JNyRhBOVkyR0Kl0S7lB5olijFGuUYo1y8WEq36TSJeEOlS4JnUqn8psUa5RijVKsUS5eloRvSkKn0qm8KQknKp3KNxVrlGKNUqxR4g/WGMUapVijFGuUYo1SrFGKNUqxRinWKMUapVijFGuUYo1SrFGKNUqxRvkHv7QE9MppxbsAAAAASUVORK5CYII=';
    
	// ** Private constructor **
	constructor( key ) {
		super();
		if ( key !== GenerateDocCmd.#Key ) {
			throw new TypeError("'GenerateDocCmd' constructor is private");
		}
        this._name = "GenerateDocCmd";
		this._description = "Generate Document";
	} // ** Private constructor ** 'Singleton' design pattern
	
	async run( args ) {
		konsola.warn('> GenerateDocCmd.run()  *args*: ' + JSON.stringify(args));
		let run_result = await super.run(args); 
		if (! run_result) {
			let main_window = this.electron_main.getMainWindow();
			// konsola.msg('   main_window 1: ' + main_window + "  " + main_window.constructor.name);
			
			let doc_content = "";
			if (args.length > 1) { 			   
				doc_content = args[1];
				konsola.msg('   doc_content is *args[1]*: ' + doc_content);
			}
			else {				
				doc_content = LoremIpsum.Generate();
				konsola.msg('   doc_content is *Random*: ' + doc_content);
			}
			// konsola.msg('   doc_content: ' + doc_content);

            // Update <textarea>
			main_window.webContents.send
				( "fromMain", [ FromMain_DOM_SET_NODE_ATTRIBUTE, QRCODE_MSG_ID, "value", doc_content ] );

			if (doc_content == undefined || doc_content == '') {
				konsola.notice('   doc_content is EMPTY');
				return;
			}
			
			let img_data_URL = await QRCode.toDataURL(doc_content);
			AppModel.This.setValue(IMG_DATA_URL_KEY, img_data_URL);
			// konsola.msg('   dataURL: ' + dataURL);	

            // Update <img>
			main_window.webContents.send
				( "fromMain", [ FromMain_DOM_SET_NODE_ATTRIBUTE, QRCODE_IMG_ID, "src", img_data_URL ] );			
		}
	} // async run()
	
	static get This() {
		if( GenerateDocCmd.#Singleton == undefined ) {
			this.#Singleton = new GenerateDocCmd();
			if (this.#InstanceCount > 0) {
				throw new TypeError("'GenerateDocCmd' constructor called more than once");
			}
			this.#InstanceCount++;
        }
        return GenerateDocCmd.#Singleton;
    } // GenerateDocCmd get This	
} // GenerateDocCmd class

// https://stackoverflow.com/questions/10914751/loading-node-js-modules-dynamically-based-on-route/12259975
module.exports = function(module_holder) {
    // the key in this dictionary can be whatever you want just make sure it won't override other modules
	// konsola.log(">> Adding 'GenerateDocCmd' export_func");
    module_holder['GenerateDocCmd'] = GenerateDocCmd.This;
	return module_holder;
};