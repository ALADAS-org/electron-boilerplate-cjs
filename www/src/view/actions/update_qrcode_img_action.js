// =========================================================================================
// ============================   update_qrcode_img_action.js   ============================
// =========================================================================================
// NB: 'Atomic Operation' for client side (Renderer process / Browser)
"use strict";

class UpdateQRcodeImageAction extends AbstractAction {
	static #_Key = Symbol();
	static #_Singleton = new UpdateQRcodeImageAction( this.#_Key );
	static #_InstanceCount = 0;

    // ** Private constructor **
	constructor( key ) {
		super();
		// konsola.msg('> new UpdateQRcodeImageAction');
		if ( key !== UpdateQRcodeImageAction.#_Key ) {
			throw new TypeError("'UpdateQRcodeImageAction' constructor is private");
		}
        this._name = "UpdateQRcodeImage";
		this._description = "Update QRcode Image";
		
		const action_handler_func = async () => {
			konsola.msg(" Action handler_function ");
			await this.execute;
		}; // action_handler_func
		
	} // ** Private constructor ** 'Singleton' design pattern
	
	async setEventHandler() {
		konsola.msg('> UpdateQRcodeImageAction.setEventHandler()');
		document.body.addEventListener(DOM_EVT_UPDATE_QRCODE_TEXT, this.execute, false);
    } // async setEventHandler()
	
	async execute(args) {
		konsola.msg('> UpdateQRcodeImageAction.execute()');
		
		let img_node = document.getElementById(QRCODE_IMG_ID);
		if (img_node == undefined) return;
		
		let src_value = img_node.getAttribute("src");		
		// konsola.msg('   src_value: ' + src_value);
								
		let qr_code_decoder = new QrcodeDecoder();
		let result = await qr_code_decoder.decodeFromImage(src_value);
		let qrcode_data = result['data'];
		// console.log("qrcode_data: " + qrcode_data);
		
		let text_node = document.getElementById(QRCODE_MSG_ID);
		HtmlUtils.SetValue(text_node, qrcode_data);	
	} // async execute()
	
	static get This() {
		if( UpdateQRcodeImageAction.#_Singleton == undefined ) {
			this.#_Singleton = new UpdateQRcodeImageAction();
			if (this.#_InstanceCount > 0) {
				throw new TypeError("'UpdateQRcodeImageAction' constructor called more than once");
			}
			this.#_InstanceCount++;
        }
        return UpdateQRcodeImageAction.#_Singleton;
    } // UpdateQRcodeImageAction get This	
} // UpdateQRcodeImageAction class

ActionRegistry.This.register(UpdateQRcodeImageAction.This.key, UpdateQRcodeImageAction.This);