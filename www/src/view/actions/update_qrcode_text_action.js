// ==========================================================================================
// ============================   update_qrcode_text_action.js   ============================
// ==========================================================================================
// NB: 'Atomic Operation' for client side (Renderer process / Browser)
"use strict";

class UpdateQRcodeTextAction extends AbstractAction {
	static #Key = Symbol();
	static #Singleton = new UpdateQRcodeTextAction( this.#Key );
	static #InstanceCount = 0;

    // ** Private constructor **
	constructor( key ) {
		super();
		// konsola.msg('> new UpdateQRcodeTextAction');
		if ( key !== UpdateQRcodeTextAction.#Key ) {
			throw new TypeError("'UpdateQRcodeTextAction' constructor is private");
		}
        this._name = "UpdateQRcodeText";
		this._description = "Update QRcode Text";
		
		const action_handler_func = async () => {
			konsola.msg(" Action handler_function ");
			await this.execute;
		}; // action_handler_func
		
	} // ** Private constructor ** 'Singleton' design pattern
	
	async setEventHandler() {
		konsola.msg('> UpdateQRcodeTextAction.setEventHandler()');
		document.body.addEventListener(DOM_EVT_UPDATE_QRCODE_TEXT, this.execute, false);
    } // async setEventHandler()
	
	async execute(args) {
		konsola.msg('> UpdateQRcodeTextAction.execute()');
		
		let img_node = document.getElementById(QRCODE_IMG_ID);
		if (img_node == undefined) return;
		
		let src_value = img_node.getAttribute("src");		
		// konsola.msg('   src_value: ' + src_value);
								
		let qr_code_decoder = new QrcodeDecoder();
		let result = await qr_code_decoder.decodeFromImage(src_value);
		let qrcode_data = result['data'];
		console.log("qrcode_data: " + qrcode_data);
		
		let text_node = document.getElementById(QRCODE_MSG_ID);
		HtmlUtils.SetValue(text_node, qrcode_data);	
	} // async execute()
	
	static get This() {
		if( UpdateQRcodeTextAction.#Singleton == undefined ) {
			this.#Singleton = new UpdateQRcodeTextAction();
			if (this.#InstanceCount > 0) {
				throw new TypeError("'UpdateQRcodeTextAction' constructor called more than once");
			}
			this.#InstanceCount++;
        }
        return UpdateQRcodeTextAction.#Singleton;
    } // UpdateQRcodeTextAction get This	
} // UpdateQRcodeTextAction class

ActionRegistry.This.register(UpdateQRcodeTextAction.This.key, UpdateQRcodeTextAction.This);