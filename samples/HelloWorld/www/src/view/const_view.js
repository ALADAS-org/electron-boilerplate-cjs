// =====================================================================================
// =================================   const_view.js   =================================
// =====================================================================================
"use strict";

const LABEL_KEY_HTML_ATTR   = "labelKey";
const COMMAND_KEY_HTML_ATTR = "commandKey";

const COMMAND_PALETTE_SLOT = "command_palette_slot";

const QRCODE_EDITOR_BODY_ID = "qrcode_editor_body_id";
const QRCODE_IMG_ID = "qrcode_img_id";
const QRCODE_MSG_ID = "qrcode_msg_id";

const QRCODE_MSG_PLACEHOLDER_ID = "QRcodeMsgPlaceHolder";

// --------------------  Main Toolbar  --------------------
const NEW_FILE_ICON_ID        = "new_file_icon_id";
const TOGGLE_DEVTOOLS_ICON_ID = "toggle_devtools_icon_id";
// --------------------  Main Toolbar

if ( typeof exports === 'object' ) {
	exports.QRCODE_IMG_ID = QRCODE_IMG_ID
	exports.QRCODE_MSG_ID = QRCODE_MSG_ID
	exports.QRCODE_MSG_PLACEHOLDER_ID = QRCODE_MSG_PLACEHOLDER_ID
	exports.COMMAND_PALETTE_SLOT = COMMAND_PALETTE_SLOT
} // exports of 'const_view.js'