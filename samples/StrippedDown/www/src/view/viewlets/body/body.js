// =======================================================================================
// =====================================   body.js   =====================================
// =======================================================================================
"use strict";

const APP_VERSION_LABEL_ID = "app_version_label";

class BodyViewlet { 
	static async Update() {
		konsola.msg("> BodyViewlet.Update");		
	}; // BodyViewlet.Update()
	
	static async UpdateQRcode() {
		console.log('> BodyViewlet.UpdateQRcode()');
		let qrcode_msg_node = document.getElementById('qrcode_msg_id');
		let msg = HtmlUtils.GetValue(qrcode_msg_node);
		console.log('   msg: ' + msg);
		await window.ipcMain.CallCommand(['GenerateDocCmd', msg]);
	} // BodyViewlet.UpdateQRcode()
} // BodyViewlet class 

ViewletLoader.This.registerViewlet("BodyViewlet", BodyViewlet.Update);