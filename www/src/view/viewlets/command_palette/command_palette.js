// ==========================================================================================
// ==============================      command_palette.js      ==============================
// ==========================================================================================
"use strict";

const COMMAND_PALETTE_ID = "command_palette";
const COMMAND_LIST_ID    = "command-list";
const COMMAND_ITEM_KLS   = "CommandItem";
const COMMAND_KEY_ATTR   = "commandKey";

class CommandPalette {
	static #Key = Symbol();
	static #Singleton = new CommandPalette( this.#Key );
	static #InstanceCount = 0;

    // ** Private constructor **
	constructor( key ) {
		if ( key !== CommandPalette.#Key ) {
			throw new TypeError("'CommandPalette' constructor is private");
		}
		// konsola.msg("> new CommandPalette (Singleton)");
        this.name = "CommandPalette";
	} // ** Private constructor ** 'Singleton' design pattern
	
	init() {
		// konsola.msg("> CommandPalette.init");
		// if (this.initialized) return;
		
		$(document).click(function(event) { 
		  let $target = $(event.target);
		  if(!$target.closest('#command_palette_slot').length && 
			  $('#command_palette_slot').is(":visible")) {
				$('#command_palette_slot').hide();
			  }        
		});
	} // init()
	
	async fillCommandList() {
		konsola.msg("> CommandPalette.fillCommandList");
		
		this.init();
		$('#command_palette_slot').show();
		
		let command_keys = await window.ipcMain.GetCommandKeys();
		// konsola.msg('> command_keys ' + JSON.stringify(command_keys));
		
		let cmd_list_elt = document.getElementById('command-list');
		// konsola.msg('> cmd_list_elt ' + cmd_list_elt);
		
		cmd_list_elt.textContent = '';
		
		const handler_function = async (command_key) => {
			// konsola.msg(" 'click' handler_function " + command_key);
			await window.ipcMain.CallCommand([command_key]);
		}; // handler_function
		
		for (let i=0; i < command_keys.length; i++) {
			let command_key = command_keys[i];
			if (command_key == 'ToggleCommandPaletteCmd') {
				continue;
			}
			
			let command_infos = await window.ipcMain.GetCommandInfos(command_key);
			
			let command_item = document.createElement("a");
			command_item.setAttribute("class", "CommandItem");
			command_item.setAttribute("commandKey", command_key);
			let description_txt = document.createTextNode(command_infos["description"]);
			command_item.appendChild(description_txt);
			
			// https://stackoverflow.com/questions/256754/how-to-pass-arguments-to-addeventlistener-listener-function			
			command_item.addEventListener('click', handler_function.bind(null, command_key));
			
			cmd_list_elt.appendChild(command_item);
			
			if (i < command_keys.length-1) {
				let child_node_BR = document.createElement("br");			
				cmd_list_elt.appendChild(child_node_BR);				
			}
		}
	} // async fillCommandList()
	
	static get This() {
		if( CommandPalette.#Singleton == undefined ) {
			this.#Singleton = new CommandPalette();
			if (this.#InstanceCount > 0) {
				throw new TypeError("'CommandPalette' constructor called more than once");
			}
			this.#InstanceCount++;
        }
        return CommandPalette.#Singleton;
    } // CommandPalette get This	
} // CommandPalette class

CommandPalette.This;

// HtmlComponentLoader.This.registerComponent("command-palette", CommandPalette.This.init);