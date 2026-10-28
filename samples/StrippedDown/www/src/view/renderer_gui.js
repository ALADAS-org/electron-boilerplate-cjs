// =====================================================================================================
// ========================================   renderer_gui.js   ========================================
// =====================================================================================================
"use strict";

class RendererGUI {
	static #_Key = Symbol();
	static #_Singleton = new RendererGUI( this.#_Key );
	static #_InstanceCount = 0;
	
	// ** Private constructor **
	constructor( key ) {
		if ( key !== RendererGUI.#_Key ) {
			throw new TypeError("'RendererGUI' constructor is private");
		}		
		
		this.custom_events = {};
		
		window.onload = async (e) => { 
		    konsola.msg('> RendererGUI.onLoad');
			// await ActionRegistry.This.setEventHandlers();
		}; // window.onload
		
		window.ipcMain.receive( 'fromMain', async (data) => { await this.onGUIEvent(data); } ); 
	} // ** Private constructor ** 'Singleton' design pattern
	
	registerCallbacks() {
		konsola.msg('> RendererGUI.registerCallbacks');
		// NB: "menubar" callbacks managed in 'view/html_components/menybar.js'
		this.setToolbarCallbacks();		
	} // registerCallbacks()
	
	setToolbarCallbacks() {
		// -------------------- Toolbar icon buttons --------------------
        // NB: now done in viewlets/main_toolbar/main_toolbar.js 		
		// this.setEventHandler( TOGGLE_DEVTOOLS_ICON_ID, 'click', (evt) => { this.onToggleDebug(evt); } );		
		// -------------------- Toolbar icon buttons	
	} // setToolbarCallbacks()
	
	// ===============================   Event Handlers   ================================
	async onGUIEvent( data ) {
		let event_name = data[0];	
		let msg              = "";
		let description_data = "";
		
		konsola.msg('> RendererGUI.onGUIEvent: ' + event_name);
				
		switch ( event_name ) {
			case FromMain_DID_FINISH_LOAD:
				konsola.msg('> RendererGUI.onGUIEvent: FromMain_DID_FINISH_LOAD');
				this.registerCallbacks();

				ViewletLoader.This.updateViewlets();
				await ActionRegistry.This.setEventHandlers();  
							
				break;
				
			case FromMain_CALL_ACTION:
				konsola.msg('> RendererGUI.onGUIEvent: FromMain_CALL_ACTION');
				if (data.length >= 2) {
					let action_name = data[1];
					if (action_name != undefined) {
						konsola.msg('   action_name: ' + action_name);
					}
					
					let args = {};
					if (data.length >= 3) {
						args = data[2];
						if (args != undefined) {
							// konsola.msg('   args: ' + JSON.stringify(args));
						}
					}
					
					let action_obj = ActionRegistry.This.getAction(action_name);
					// konsola.msg('   action_obj: ' + action_obj);
					if (action_obj != undefined) {
							await action_obj.execute(args);
					}
				}
				break;

			case FromMain_DOM_DISPATCH_EVENT:
				konsola.msg('> RendererGUI.onGUIEvent: FromMain_DOM_DISPATCH_EVENT');
				konsola.msg('   data.length: ' + data.length);				
				if (data.length == 4) {
					// https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent/CustomEvent
					let custom_event_name = data[1]; // e.g. DOM_EVT_UPDATE_QRCODE_TEXT	
					let source_node_id    = data[2];
					let target_node_id    = data[3];
					
					konsola.msg('   custom_event_name: ' + custom_event_name);
					konsola.msg('   source_node_id: '    + source_node_id);
					konsola.msg('   target_node_id: '    + target_node_id);
					
					let source_node = document.getElementById(source_node_id);
					if (source_node == undefined) return;
					
					konsola.msg('   source_node FOUND');
					
					if (this.custom_events[custom_event_name] == undefined) {	
						const new_event_obj = new CustomEvent(custom_event_name, 
						                          { detail: { 'target_node_id': target_node_id } });
						this.custom_events[custom_event_name] = new_event_obj;
					}
        
					let custom_event = this.custom_events[custom_event_name]; 
					document.body.dispatchEvent(custom_event);
				}						
				break;			

			case FromMain_DOM_GET_NODE_ATTRIBUTE:
			    // konsola.info('-> RendererGUI.onGUIEvent: FromMain_DOM_GET_NODE_ATTRIBUTE');
				konsola.msg('> RendererGUI.onGUIEvent: FromMain_DOM_GET_NODE_ATTRIBUTE');
				if (data.length == 3) {
					let node_id        = data[1];
					let attribute_name = data[2];
					let attribute_value = "";
					
					let dom_node = document.getElementById(node_id);	
					if (dom_node != undefined) {
						attribute_value = dom_node.getAttribute(attribute_name);
						konsola.msg( '   attribute_value: ' + attribute_value );
						window.store.SetValue(node_id + "." + attribute_name, attribute_value);		
					}					
				}				
				break;
				
			case FromMain_DOM_SET_NODE_ATTRIBUTE:
				konsola.msg('> RendererGUI.onGUIEvent: FromMain_DOM_SET_NODE_ATTRIBUTE');
				if (data.length == 4) {
					let node_id         = data[1];					
					let attribute_name  = data[2];					
					let attribute_value = data[3];
					
					let dom_node = document.getElementById(node_id);
					
					konsola.msg(  '   node_id: ' + node_id + "  " 
					            + '   attr_name: ' + attribute_name + "   "
							    + '   attr_value: ' + attribute_value );		
				
					if (attribute_name == 'value') {	
						HtmlUtils.SetValue(dom_node, attribute_value);
                    }					
					else if (dom_node != undefined) {
						dom_node.setAttribute(attribute_name, attribute_value);                        						
					}					
				}
				break;
				
			case FromMain_DOM_SET_NODE_VISIBILITY:
				konsola.msg('> RendererGUI.onGUIEvent: FromMain_DOM_SET_NODE_VISIBILITY');
				// konsola.msg('   data: ' + JSON.stringify(data));
				if (data.length > 1) {
					let node_id = data[1];
					konsola.msg('   node_id: ' + node_id);
					let node = document.getElementById(node_id);
					if (node != undefined) {
						HtmlUtils.ToggleNodeVisibility(node);
					}
					
					if (node_id == COMMAND_PALETTE_SLOT) {
						await CommandPalette.This.fillCommandList();
					}
				}
				break;		

			case FromMain_NEW_FILE_CMD:
				konsola.msg('> RendererGUI.onGUIEvent: FromMain_NEW_FILE_CMD');
				break;		

			case FromMain_HELP_ABOUT_CMD:
				konsola.msg('> RendererGUI.onGUIEvent: FromMain_HELP_ABOUT_CMD');
				if (data.length > 2) {
					let title = data[1];
					let content = await window.ipcMain.GetL10nMsg("HelpAboutMsg");  

					description_data =  "<center><b>" + title + "</b></center><br>" 
									  + "&nbsp;" + content;

					// https://izitoast.marcelodolza.com/
					DialogUtils.Clean();
					DialogUtils.ShowInfo(description_data);
				}				
				break;
				
			case FromMain_SHOW_DIALOG_CMD:
				konsola.msg('> RendererGUI.onGUIEvent: FromMain_SHOW_DIALOG_CMD');
				if (data.length > 1) {
					msg = data[1];
					description_data = "<center><b>" + msg + "</b></center>";

					// https://izitoast.marcelodolza.com/
					DialogUtils.Clean();
					DialogUtils.ShowInfo(description_data);
				}				
				break;				
				
			default:
				konsola.msg('> RendererGUI.onGUIEvent: ACK[' + event_name + '] from main');
				// DialogManager.Clean();
				break;
		} // switch ( event_name )
	} // onGUIEvent()
	
	onToggleDebug(evt) {
		konsola.msg('> RendererGUI.onToggleDebug');
		window.ipcMain.ToggleDebugPanel();
	} // onToggleDebug()
	// ===============================   Event Handlers
	
	static get This() {
		if( RendererGUI.#_Singleton == undefined ) {
			this.#_Singleton = new RendererGUI();
			if (this.#_InstanceCount > 0) {
				throw new TypeError("RendererGUI constructor called more than once.");
			}
			this.#_InstanceCount++;
        }
        return RendererGUI.#_Singleton;
    } // RendererGUI get This 
	
	setEventHandler( elt_id, event_name, handler_function ) {
		let elt = document.getElementById( elt_id );
		if ( elt != undefined ) { 
			elt.addEventListener(event_name, handler_function );
		}
	} // setEventHandler()	
} // RendererGUI class

RendererGUI.This;