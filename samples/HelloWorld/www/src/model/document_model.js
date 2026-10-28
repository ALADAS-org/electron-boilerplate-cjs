// ===========================================================================================
// ===================================   document_model.js   =================================
// ===========================================================================================
"use strict";

const { app } = require('electron');
const { konsola } = require( app.getAppPath() + '/www/src/utils/log/konsola.js');

class DocumentModel {
	static #InstanceCount = 0;
	
	constructor(args) {
		this.attributes = {};
		this.attributes['name'] = "doc_" + DocumentModel.#InstanceCount++;
		if (args != undefined && args['name'] != undefined) {
			this.attributes['name'] = args['name'];
		}
		
		this.attributes['content'] = "";
		if (args != undefined && args['content'] != undefined) {
			this.attributes['content'] = args['content'];
		}
		
		this.attributes['type'] = "txt";
		if (args != undefined && args['type'] != undefined) {
			this.attributes['type'] = args['type'];
		}
	} // constructor
	
	get name() {
		return this.name;
    } // get 'name'
	
	get content() {
		return this.content;
    } // get 'content'
	
	get keys() {
		return Object.keys(this.attributes);
    } // get 'keys'
	
	getValue(key) {
		if (this.attributes[key] != undefined) {
			return this.attributes[key];
		}
		return "";
    } // getValue()
} // DocumentModel class

exports.DocumentModel = DocumentModel