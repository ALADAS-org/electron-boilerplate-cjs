// ======================================================================================
// ===================================   menubar.js   ===================================
// ======================================================================================
"use strict";

const MAIN_MENUBAR_ID = "main_menu_bar";

class MenuBarViewlet { 
	static Update() {
		konsola.msg("> MenuBarViewlet.Update");
		
		$( document ).ready( async () => {
			konsola.msg("> MenuBarViewlet: set Event Handlers '" + MAIN_MENUBAR_ID + "'");
			let menu_bar_elt = document.getElementById("main_menu_bar");
			// konsola.msg('> menu_bar_elt ' + menu_bar_elt);
			
			let menu_item_buttons = HtmlUtils.GetElementsByClassName(menu_bar_elt, "MenuItemButton");
			// konsola.msg('   menu_labels: ' + menu_labels.length );
			
			const handler_function = async (args) => {
				// konsola.msg(" 'click' handler_function " + command_key);
				await window.ipcMain.CallCommand(args);
			}; // handler_function
			
			const localizeMenuBar = async () => {
				konsola.msg('> MenuBarViewlet.localizeMenuBar');
				let menu_bar_elt = document.getElementById(MAIN_MENUBAR_ID);
				// konsola.msg('   menu_bar_elt: ' + menu_bar_elt + " typeof: " + typeof menu_bar_elt );
				let menu_labels = HtmlUtils.GetElementsByClassName(menu_bar_elt, "MenuLabel");
				// konsola.msg('   menu_labels: ' + menu_labels.length );
				for (let i = 0; i < menu_labels.length; i++) {
					let menu_label = menu_labels[i];			
					let key = menu_label.attributes[LABEL_KEY_HTML_ATTR].value;
					
					let L10n_msg = await window.ipcMain.GetL10nMsg(key);
					// konsola.msg('   key: ' + key + ' L10n_msg: ' + L10n_msg );
					
					menu_label.innerText = L10n_msg;
				}
			}; // localizeMenuBar()
			
			for (let i = 0; i < menu_item_buttons.length; i++) {
				let menu_item_button = menu_item_buttons[i];
				let command_key = menu_item_button.attributes["commandKey"].value;
				// https://stackoverflow.com/questions/256754/how-to-pass-arguments-to-addeventlistener-listener-function			
				menu_item_button.addEventListener('click', handler_function.bind(null, [command_key]));			
			}

			await localizeMenuBar();
		}); // jQuery.onReady
	}; // Update()
} // MenuBarViewlet class 

ViewletLoader.This.registerViewlet("MenuBarViewlet", MenuBarViewlet.Update);