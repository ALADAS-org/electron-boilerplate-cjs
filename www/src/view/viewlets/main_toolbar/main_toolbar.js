// =======================================================================================
// =================================   main_toolbar.js   =================================
// =======================================================================================
"use strict";

const MAIN_TOOLBAR_ID = "toolbar_id";

class MainToolbarViewlet { 
	static Update() {
		konsola.msg("> MainToolbarViewlet.Update");
		
		$( document ).ready( async () => {
			// konsola.msg("> MainToolbarViewlet: set Event Handlers '" + MAIN_TOOLBAR_ID + "'");
			let main_toolbar_elt = document.getElementById(MAIN_TOOLBAR_ID);
			// konsola.msg('   main_toolbar_elt ' + main_toolbar_elt);
			
			let toolbar_icon_nodes = HtmlUtils.GetElementsByClassName(main_toolbar_elt, "ToolbarIcon");
			
			const handler_function = async (args) => {
				// konsola.msg(" 'click' handler_function " + command_key);
				await window.ipcMain.CallCommand(args);
			}; // handler_function
			
			for (let i=0; i<toolbar_icon_nodes.length; i++) {
				let icon_node = toolbar_icon_nodes[i];
				// konsola.msg(" icon_node " + icon_node.id);
				
				let command_key = icon_node.attributes["commandKey"].value;
				// https://stackoverflow.com/questions/256754/how-to-pass-arguments-to-addeventlistener-listener-function			
				icon_node.addEventListener('click', handler_function.bind(null, [command_key]));
			}
		}); // jQuery.onReady
	}; // MainToolbarViewlet.Update()
} // MainToolbarViewlet class 

ViewletLoader.This.registerViewlet("MainToolbarViewlet", MainToolbarViewlet.Update);