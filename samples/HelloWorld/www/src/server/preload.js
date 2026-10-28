// ====================================================================================
// ==================================   preload.js   ==================================
// ====================================================================================
"use strict"

// https://github.com/cdaein/p5js-electron-canvas-saver-boilerplate
const { contextBridge, ipcRenderer } = require('electron');

// konsola.log(">> ====== preload ======");

const functionName = ( fun ) => {
  var ret = fun.toString();
  ret = ret.substr('function '.length);
  ret = ret.substr(0, ret.indexOf('('));
  return ret;
}; // functionName()

contextBridge.exposeInMainWorld(
	"store", {
		GetValue:                       (key)  => ipcRenderer.invoke("ToMain:Request/get_model_value", key),
		SetValue:                       (args) => ipcRenderer.send("ToMain:Request/set_model_value", args)
	}
); // 'store' apiKey

contextBridge.exposeInMainWorld(
	"ipcMain", {
		CallCommand:                    (args) => ipcRenderer.invoke("ToMain:Request/call_command", args),
		GetCommandKeys:                 ()     => ipcRenderer.invoke("ToMain:Request/get_cmd_keys"),

		GetModelValue:                  (key)  => ipcRenderer.invoke("ToMain:Request/get_model_value", key),
		SetModelValue:                  (args) => ipcRenderer.send("ToMain:Request/set_model_value", args),
		
		GetCommandInfos:                (key)  => ipcRenderer.invoke("ToMain:Request/get_cmd_infos", key),

		QuitApp:                        ()     => ipcRenderer.invoke("ToMain:Request/quit_app"),		
		ToggleDebugPanel:               (data) => ipcRenderer.send("ToMain:Request/toggle_debug_panel", data),	
        GetL10nMsg:                     (key)  => ipcRenderer.invoke("ToMain:Request/get_L10n_Msg", key),
		ReadFile:                       (path) => ipcRenderer.invoke("ToMain:Request/read_file", path),		
	    		
        receive: ( channel, func ) => {
            let valid_channels = ['fromMain'];
			// console.log(">> preload: receive 1 channel: '" + channel + "'  func: " + functionName( func ) );
            if ( valid_channels.includes( channel ) ) {
				// konsola.log(">> preload: send 2");
                // Deliberately strip event as it includes `sender` 
                ipcRenderer.on( channel, (event, ...args) => { 
				    let event_name = args[0][0]; 
				    // konsola.log( "<" + event_name + "> from 'main' to 'renderer'" ); 
					// if ( event_name != "FromMain:SendImageURL" ) {
					//	 konsola.log( "args: " + JSON.stringify(args) ); 
					// }
					func(...args);
				} );
            }
        }
	} 
); // 'ipcMain' apiKey
