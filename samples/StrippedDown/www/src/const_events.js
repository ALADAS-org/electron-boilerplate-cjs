// =====================================================================================
// ================================   const_events.js   ================================
// =====================================================================================
"use strict";

const DOM_EVT_UPDATE_QRCODE_TEXT   = "DOM_Evt_UpdateQRcodeText";

const APP_QUIT_CMD                 = "AppQuitCmd";
const RUN_COMMAND_RQ               = "RunCommandRequest";
const TOGGLE_COMMAND_PALETTE_CMD   = "ToggleCommandPaletteCmd";

const ToMain_RQ_GET_MODEL_VALUE    = "ToMain:Request/get_model_value";
const ToMain_RQ_SET_MODEL_VALUE    = "ToMain:Request/set_model_value";		

const ToMain_RQ_CALL_COMMAND       = "ToMain:Request/call_command";

const ToMain_RQ_GET_COMMAND_KEYS   = "ToMain:Request/get_cmd_keys";
const ToMain_RQ_GET_COMMAND_INFOS  = "ToMain:Request/get_cmd_infos";

const ToMain_RQ_TOGGLE_DEBUG_PANEL = "ToMain:Request/toggle_debug_panel";
const ToMain_RQ_GET_L10N_MSG       = "ToMain:Request/get_L10n_Msg";

const ToMain_RQ_READ_FILE          = "ToMain:Request/read_file";

const FromMain_DID_FINISH_LOAD     = "FromMain:did-finish-load";

const FromMain_NEW_FILE_CMD        = "FromMain:NewFileCmd";
const FromMain_HELP_ABOUT_CMD      = "FromMain:HelpAboutCmd";

const FromMain_SHOW_DIALOG_CMD     = "FromMain:ShowDialogCmd";

const FromMain_DOM_DISPATCH_EVENT      = "FromMain:Request/DOM-DispatchEvent";
const FromMain_DOM_SET_NODE_ATTRIBUTE  = "FromMain:Request/DOM-Node_set_attribute";
const FromMain_DOM_GET_NODE_ATTRIBUTE  = "FromMain:Request/DOM-Node_get_attribute";
const FromMain_DOM_SET_NODE_VISIBILITY = "FromMain:DOM/SetNodeVisibility";

const FromMain_CALL_ACTION = "FromMain:CallAction";

if ( typeof exports === 'object' ) {
	exports.DOM_EVT_UPDATE_QRCODE_TEXT   = DOM_EVT_UPDATE_QRCODE_TEXT
	exports.APP_QUIT_CMD                 = APP_QUIT_CMD
    exports.RUN_COMMAND_RQ               = RUN_COMMAND_RQ	
	exports.TOGGLE_COMMAND_PALETTE_CMD   = TOGGLE_COMMAND_PALETTE_CMD
	
    exports.ToMain_RQ_GET_MODEL_VALUE    = ToMain_RQ_GET_MODEL_VALUE
	exports.ToMain_RQ_SET_MODEL_VALUE    = ToMain_RQ_SET_MODEL_VALUE

	exports.ToMain_RQ_CALL_COMMAND       = ToMain_RQ_CALL_COMMAND
	exports.ToMain_RQ_GET_COMMAND_KEYS   = ToMain_RQ_GET_COMMAND_KEYS
	exports.ToMain_RQ_GET_COMMAND_INFOS  = ToMain_RQ_GET_COMMAND_INFOS
    exports.ToMain_RQ_TOGGLE_DEBUG_PANEL = ToMain_RQ_TOGGLE_DEBUG_PANEL
	exports.ToMain_RQ_GET_L10N_MSG       = ToMain_RQ_GET_L10N_MSG
	exports.ToMain_RQ_READ_FILE          = ToMain_RQ_READ_FILE 
	
	exports.FromMain_DID_FINISH_LOAD     = FromMain_DID_FINISH_LOAD
	
	exports.FromMain_DOM_DISPATCH_EVENT      = FromMain_DOM_DISPATCH_EVENT
	exports.FromMain_DOM_SET_NODE_ATTRIBUTE  = FromMain_DOM_SET_NODE_ATTRIBUTE
	exports.FromMain_DOM_GET_NODE_ATTRIBUTE  = FromMain_DOM_GET_NODE_ATTRIBUTE
	
	exports.FromMain_DOM_SET_NODE_VISIBILITY = FromMain_DOM_SET_NODE_VISIBILITY
	
	exports.FromMain_NEW_FILE_CMD        = FromMain_NEW_FILE_CMD
	exports.FromMain_HELP_ABOUT_CMD      = FromMain_HELP_ABOUT_CMD
	exports.FromMain_SHOW_DIALOG_CMD     = FromMain_SHOW_DIALOG_CMD
	
	exports.FromMain_CALL_ACTION         = FromMain_CALL_ACTION
} // exports of 'const_events.js'