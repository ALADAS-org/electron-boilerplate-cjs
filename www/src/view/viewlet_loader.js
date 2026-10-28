// =================================================================================================
// ====================================    viewlet_loader.js     ===================================
// =================================================================================================
"use strict";

const VIEWLET_HTML_ATTR = "viewlet-html";
const TARGET_SLOT_ATTR  = "target-slot";

class ViewletLoader {
	static #Key = Symbol();
	static #_Singleton = new ViewletLoader( this.#Key );
	static #_InstanceCount = 0;

    // ** Private constructor **
	constructor( key ) {
		if ( key !== ViewletLoader.#Key ) {
			throw new TypeError("'ViewletLoader' constructor is private");
		}
		// konsola.msg("> new ViewletLoader (Singleton)");
        this.viewlets = {};
	} // ** Private constructor ** 'Singleton' design pattern
	
	async includeViewlets() {
	  // konsola.msg('> HtmlComponentLoader.includeViewlets');	
	  let z, i, elmnt, viewlet_path;
	  /*loop through a collection of all HTML elements:*/
      z = document.getElementsByTagName('*');
      for (i=0; i < z.length; i++) {
		elmnt = z[i];
		/* search for elements with a certain attribute: */
		viewlet_path = elmnt.getAttribute(VIEWLET_HTML_ATTR);
		let elt_id = elmnt.id;
		if  (viewlet_path && elt_id != undefined ) {		   	 
			// konsola.msg('> ViewletLoader.includeViewlets id: ' + elt_id);			
		   
			let html_content = await window.ipcMain.ReadFile(viewlet_path);
			let target_slot = elmnt.getAttribute(TARGET_SLOT_ATTR);
		    if (target_slot != undefined) {
				// konsola.msg('   target-slot: ' + target_slot);
				let target_elt = document.getElementById(target_slot);
				// konsola.msg('   target-slot: ' + target_elt);
				target_elt.innerHTML = html_content;
			}
			else {
				elmnt.innerHTML = html_content;
			}
			elmnt.removeAttribute(VIEWLET_HTML_ATTR);
		}
      } // for all elements; check if it has a INCLUDE_HTML_ATTR ('html-component') attribute
	} // async includeViewlets
	
	registerViewlet(elt_id, callback) {
		// konsola.msg('> ViewletLoader.registerViewlet elt_id: ' + elt_id);
		this.viewlets[elt_id] = callback;
	} // registerViewlet()
	
	async updateViewlets() {
		konsola.msg('> ViewletLoader.updateViewlets');
		let viewlet_ids = Object.keys(this.viewlets);
		for (let i=0; i < viewlet_ids.length; i++) {
			let viewlet_id = viewlet_ids[i];
			// konsola.msg('   viewlet_id: ' + viewlet_id);
			let viewlet_callback = this.viewlets[viewlet_id];
			await viewlet_callback();
		}
	} // updateViewlets()
	
	static get This() {
		if ( ViewletLoader.#_Singleton == undefined ) {
			this.#_Singleton = new ViewletLoader();
			if (this.#_InstanceCount > 0) {
				throw new TypeError("'ViewletLoader' constructor called more than once");
			}
			this.#_InstanceCount++;
        }
        return ViewletLoader.#_Singleton;
    } // ViewletLoader get This	
} // ViewletLoader class

ViewletLoader.This;