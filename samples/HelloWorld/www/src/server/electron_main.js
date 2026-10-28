// ======================================================================================
// ================================   electron_main.js   ================================
// ======================================================================================
"use strict";

const { app, BrowserWindow, Menu, ipcMain, globalShortcut } = require('electron');

const fs   = require('fs');
const path = require('path');

const { konsola } = require( app.getAppPath() + '/www/src/utils/log/konsola.js');

const APP_PATH = app.getAppPath();
// konsola.log('APP_PATH ' + APP_PATH); 

const { L10n } = require(APP_PATH + '/www/L10n/L10n.js');

const {  APP_VERSION_KEY, MAIN_WINDOW_KEY,
         DOCUMENT_DEFAULT_BASENAME_KEY, DOCUMENT_COUNT_KEY
	  } = require(APP_PATH + '/www/src/model/const_model_keys.js');
	  
const {  RUN_COMMAND_RQ, APP_QUIT_CMD, TOGGLE_COMMAND_PALETTE_CMD,
         ToMain_RQ_GET_MODEL_VALUE, ToMain_RQ_SET_MODEL_VALUE,
         ToMain_RQ_CALL_COMMAND, 
		 ToMain_RQ_GET_COMMAND_KEYS, ToMain_RQ_GET_COMMAND_INFOS,
		 ToMain_RQ_TOGGLE_DEBUG_PANEL, ToMain_RQ_GET_L10N_MSG,
		 ToMain_RQ_READ_FILE,
         FromMain_DID_FINISH_LOAD
	  } = require(APP_PATH + '/www/src/const_events.js');
	  
const { AppModel }        = require(APP_PATH + '/www/src/model/app_model.js');	  
const { CommandRegistry } = require(APP_PATH + '/www/src/controller/command_registry.js');

// const { PluginRegistry }  = require(APP_PATH + '/www/src/extensibility/plugin_registry.js');

const GotTheLock = app.requestSingleInstanceLock();

const MAIN_WINDOW_WIDTH  = 1100;
const MAIN_WINDOW_HEIGHT = 600; 

const INIT_CMD_KEY = 'NewFileCmd';

// NB: This class uses 'Singleton' design pattern 
class ElectronMain {
	static #_Key = Symbol();
	static #_Singleton = new ElectronMain( this.#_Key );
	static #_InstanceCount = 0;

    // ** Private constructor **
	constructor( key ) {
		if ( key !== ElectronMain.#_Key ) {
			throw new TypeError("'ElectronMain' constructor is private");
		}
		
		// https://stackoverflow.com/questions/37213696/how-can-i-get-the-path-that-the-application-is-running-with-typescript
		this.app_version                = "x.x.x";
		
		this.DidFinishLoad_FiredCount   = 0;
		this.Show_DebugPanel            = false;		
		this.MainWindow                 = undefined;
		
		this.full_screen                = false;	    
	} // ** Private constructor ** 'Singleton' design pattern
	
	static get This() {
		konsola.msg("> ElectronMain.This");
		if ( ElectronMain.#_Singleton == undefined ) {
			this.#_Singleton = new ElectronMain();
			if (this.#_InstanceCount > 0) {
				throw new TypeError("'ElectronMain' constructor called more than once");
			}
			this.#_InstanceCount++;
        }
		
        return ElectronMain.#_Singleton;
    } // ElectronMain get This 
	
	init() {	
        konsola.resetLevel();

        AppModel.This.setValue(DOCUMENT_DEFAULT_BASENAME_KEY, 'qrcode');
		AppModel.This.setValue(DOCUMENT_COUNT_KEY, 0);
		
		CommandRegistry.Init(this);
	
		this.createWindow();
    } // init() 
	
	createWindow() {
		konsola.msg('> ElectronMain.createWindow');
		
		// https://stackoverflow.com/questions/64478489/i-added-a-content-security-policy-but-still-the-security-warning-appears	
		process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = true;
		
		const main_window = new BrowserWindow(
			{ 	width:  MAIN_WINDOW_WIDTH, height: MAIN_WINDOW_HEIGHT,
				icon:   path.join(APP_PATH, 'www/icons/electron-boilerplate-icon.png'),
					webPreferences: {
						contextIsolation: true,  // NB: 'true' is default value but keep it there anyway
						// nodeIntegration : true, // NB: Required for 'pluggable-electron'
						// sandbox: false,         // NB: Required for 'pluggable-electron'
						preload:          path.join(__dirname, "preload.js")
				}
			} 
		);
	   
		this.MainWindow = main_window;	
		AppModel.This.setValue(MAIN_WINDOW_KEY, main_window);
		// konsola.msg("main_window: " + main_window + "typeof:" + typeof main_window);

	    // konsola.log("app_path: " + APP_PATH);
		this.displayAppVersion();
	   
		main_window.removeMenu();
	   
		// this.toggleDebugPanel();
	   
		this.setCallbacks();
	   
		// https://www.electronjs.org/docs/latest/api/web-contents#instance-events
		// https://stackoverflow.com/questions/42284627/electron-how-to-know-when-renderer-window-is-ready
		// ==================== 'did-finish-load' event handler ====================
		this.MainWindow.webContents.on( 'did-finish-load', 
			async () => {	
                // await this.setCallbacks();			
				await this.MainWindow.webContents.send( "fromMain", [ FromMain_DID_FINISH_LOAD ] );				
				// this.setCallbacks();	
			} // 'did-finish-load' callback
		); // ==================== 'did-finish-load' event handler		

	    // main_window.loadURL( app.getAppPath() + '/www/index.html' );		
		
		// https://stackoverflow.com/questions/42022712/is-it-possible-to-load-electron-webcontents-from-an-in-memory-html-string
		let index_html_with_actions = this.includeActions();
		// https://github.com/electron/electron/issues/1146
		main_window.loadURL('data:text/html;charset=utf-8,' + index_html_with_actions,
		                    { baseURLForDataURL: app.getAppPath() + '/www/' } );
	} // createWindow()
	
	// includes all 'actions' in src/view/actions
	includeActions() {
		let index_html = fs.readFileSync(app.getAppPath() + '/www/index.html').toString();
		// konsola.msg(index_html);
		const INCLUDE_ACTIONS_SLOT = '<span id="actions-include-slot" hidden>';
		
		const getActionFilenames = (in_path) => {
			let action_filenames = [];
			let filenames = fs.readdirSync(in_path);
			for (let i=0; i < filenames.length; i++) {
				let filename = filenames[i];
				if (filename != 'abstract_action.js' && filename != 'null_action.js') {
					action_filenames.push(filename);
				}
			}
			return action_filenames;
		}; // getActionFilenames()
		
		let action_filenames = getActionFilenames( app.getAppPath() + '/www/src/view/actions');
		konsola.msg('   action_files: ' + JSON.stringify(action_filenames));

		// "<span id="actions-include-slot" hidden>"
		let include_actions_slot_pos = index_html.indexOf(INCLUDE_ACTIONS_SLOT) + INCLUDE_ACTIONS_SLOT.length;
		// konsola.msg("   include_actions_slot_pos: " + include_actions_slot_pos);
		
		let include_scripts_html = "";
		for (let i=0; i < action_filenames.length; i++) {
			let action_filename = action_filenames[i];
			include_scripts_html +=  '\n\t<script type="text/javascript"'
								   + ' src="src/view/actions/' + action_filename + '"></script>'
		}
		
        let index_html_with_actions =  index_html.substring(0, include_actions_slot_pos) 
		                             + include_scripts_html
									 + index_html.substring(include_actions_slot_pos);									;  
		// konsola.msg(index_html_with_actions);
		
		return index_html_with_actions;
	} // includeActions()
	
	displayAppVersion() {
		let app_version = this.getAppVersion();
		AppModel.This.setValue(APP_VERSION_KEY, app_version);
		this.MainWindow.setTitle("Electron BYOF " + app_version);
	} // displayAppVersion()
	
	setCallbacks() { 
	    // konsola.msg('> ElectronMain.setCallbacks');
		
		// ========================== ToMain_RQ_CALL_COMMAND ==========================
		// called like this by Renderer: await window.ipcMain.CallCommand(args)
		ipcMain.handle( ToMain_RQ_CALL_COMMAND, async (event, args) => {
			konsola.msg("> Received '" + ToMain_RQ_CALL_COMMAND + "' args: " + JSON.stringify(args));			
			if (args.length == 0) return ;
			
			let key = args[0];
			konsola.msg(" ToMain_RQ_CALL_COMMAND key: " + key);
			
			let cmd_object = CommandRegistry.This.getCommand(key);
			await cmd_object.run(args);
		}); // "ToMain:Request/call_command" event handler	

		// ========================== ToMain_RQ_READ_FILE ==========================
		// called like this by Renderer: await window.ipcMain.ReadFile(path)
		ipcMain.handle( ToMain_RQ_READ_FILE, async (event, path) => {
			// konsola.msg("> Received '" + ToMain_RQ_READ_FILE + "' event");
			// konsola.msg(" ToMain_RQ_READ_FILE path: " + path);
			let file_path = app.getAppPath() + "/www/" + path;
			// konsola.msg(" ToMain_RQ_READ_FILE file_path: " + file_path);
			let file_content = fs.readFileSync(file_path, "utf-8");
			return file_content;
		}); // "ToMain:Request/read_file" event handler			
		
		// ========================== ToMain_RQ_GET_COMMAND_KEYS ==========================
		// called like this by Renderer: await window.ipcMain.GetCommandKeys()
		ipcMain.handle( ToMain_RQ_GET_COMMAND_KEYS, async (event, data) => {
			// konsola.msg("> Received '" + ToMain_RQ_GET_COMMAND_KEYS + "' event");
			let cmd_keys = CommandRegistry.This.getKeys();
			return cmd_keys;
		}); // "ToMain:Request/get_cmd_keys" event handler

	  	// ========================== ToMain_RQ_GET_COMMAND_INFOS ==========================
		// called like this by Renderer: await window.ipcMain.GetCommandInfos(cmd_key)
		ipcMain.handle( ToMain_RQ_GET_COMMAND_INFOS, async (event, cmd_key) => {
			konsola.msg("> Received '" + ToMain_RQ_CALL_COMMAND + "' cmd_key: " + cmd_key);			
			if (cmd_key == undefined) return ;
			
			let cmd_object = CommandRegistry.This.getCommand(cmd_key);
			let cmd_infos  = cmd_object.getInformations();
			return cmd_infos;
		}); // "ToMain:Request/get_cmd_infos" event handler
		
		
		// ========================== ToMain_RQ_GET_MODEL_VALUE ==========================
		// called like this by Renderer: await window.store.GetValue(key)
		// or                            await window.ipcMain.GetModelValue(key)
		ipcMain.handle( ToMain_RQ_GET_MODEL_VALUE, async (event, key) => {
			// konsola.msg(">> Received '" + ToMain_RQ_GET_MODEL_VALUE + "' event");
			let model_value = AppModel.This.getValue(key);
			return model_value;	
		}); // "ToMain:Request/get_model_value" event handler

		// ========================== ToMain_RQ_SET_MODEL_VALUE ==========================
		// called like this by Renderer: window.ipcMain.SetModelValue(key, value)
		// or                            window.store.SetValue(key, value)
		ipcMain.on( ToMain_RQ_SET_MODEL_VALUE, (event, args) => {
			// konsola.msg(">> Received '" + ToMain_RQ_SET_MODEL_VALUE + "' event");
			if (args.length == 2) {
				let key   = args[0];
				let value = args[1];
				konsola.msg("   key: " + key + "   value:" + value);
				AppModel.This.setValue(key,value);
			}	
		}); // "ToMain:Request/set_model_value" event handler
		
		
		// ========================== ToMain_RQ_TOGGLE_DEBUG_PANEL ==========================
		// called like this by Renderer: window.ipcMain.ToggleDebugPanel(data)
		ipcMain.on( ToMain_RQ_TOGGLE_DEBUG_PANEL, (event, data) => {
			// konsola.msg(">> Received '" + ToMain_RQ_TOGGLE_DEBUG_PANEL + "' event");
			this.toggleDebugPanel();
		}); // "ToMain:Request/toggle_debug_panel" event handler	
		
		// ========================== ToMain_RQ_GET_L10N_MSG ==========================
		// called like this by Renderer: await window.ipcMain.GetL10nMsg(msg_key)
		ipcMain.handle( ToMain_RQ_GET_L10N_MSG, async (event, msg_key) => {
			// konsola.msg(">> Received '" + ToMain_RQ_GET_L10N_MSG + "' event   msg_key: " + msg_key);
			return L10n.This.getMsg(msg_key);
		}); // "ToMain:Request/get_L10n_Msg" event handler		
		
		// https://stackoverflow.com/questions/48284207/emit-custom-events-in-electron-app-from-main-to-renderer
		app.on(RUN_COMMAND_RQ, 
			async (args) => {
				konsola.msg(">> Received " + RUN_COMMAND_RQ + " args: " + JSON.stringify(args));
			    // this.MainWindow.webContents.send(RUN_COMMAND_RQ);
				
				if (args.length == 0) return ;
			
				let key = args[0];
				konsola.msg("   key: " + key);
				
				let cmd_object = CommandRegistry.This.getCommand(key);
				await cmd_object.run(args);
			}
		); // 'RUN_COMMAND_RQ' event handler: run command from its key (eg. 'AppQuitCmd')
		
		this.setKeyShortcuts();
	} // setCallbacks()
	
	setKeyShortcuts() { 
		// https://www.electronjs.org/docs/latest/tutorial/keyboard-shortcuts
		// https://docs.github.com/en/codespaces/reference/using-the-vs-code-command-palette-in-codespaces
		// *** 'CTRL Shift P' ***: shortcut for 'Command Palette' in Visual Studio Code
		this.MainWindow.webContents.on('before-input-event', async (event, input) => {
			if (input.control && input.shift && input.key.toLowerCase() === 'p') {
				// konsola.msg("> *Shortcut Event* Pressed 'CTRL Shift P'");
				let toggle_cmd_palette_obj = CommandRegistry.This.getCommand(TOGGLE_COMMAND_PALETTE_CMD);
				await toggle_cmd_palette_obj.run([]);
				event.preventDefault();
			}
		});
	} // setKeyShortcuts()
	
	getAppVersion() { 
		// Skribi.log( "MainModel.getAppVersion" );		
		this.app_version = require( APP_PATH + '/package.json').version;
		return this.app_version;
	} // getAppVersion()

    getMainWindow() {
		return this.MainWindow;
	} // getMainWindow()

    toggleFullScreen() {
		konsola.msg('> ElectronMain.toggleFullScreen full_screen:' + this.full_screen);
		this.full_screen = ! this.full_screen;
		if (this.full_screen) {
			// https://stackoverflow.com/questions/40445068/electron-take-up-100-of-screen-not-full-screen
			this.MainWindow.setFullScreen(true);
			this.MainWindow.maximize();			
		}
		else {		
            this.MainWindow.setFullScreen(false);		
			this.MainWindow.unmaximize();	
			
			if ( this.Show_DebugPanel )
				this.MainWindow.webContents.openDevTools();
			else
				this.MainWindow.webContents.closeDevTools();
						
			let default_win_size = this.getDefaulWindowSize();
			this.MainWindow.setSize(default_win_size.width, default_win_size.height);			
		}
	} // toggleFullScreen()	
	
	getDefaulWindowSize() {
		return { "width": MAIN_WINDOW_WIDTH, "height": MAIN_WINDOW_HEIGHT };
	} // getDefaulWindowSize()
	
	getDebugPanelVisible() {
		konsola.msg('> ElectronMain.getDebugPanelVisible');
		return this.Show_DebugPanel;
	} // getDebugPanelVisible()
	
	toggleDebugPanel() {
		konsola.msg('> ElectronMain.toggleDebugPanel');
		this.Show_DebugPanel = ! this.Show_DebugPanel;
		
		if ( this.Show_DebugPanel )
			this.MainWindow.webContents.openDevTools();
		else
			this.MainWindow.webContents.closeDevTools();
	} // toggleDebugPanel()
	
	quitApp() { 
		konsola.msg('> ElectronMain.quitApp');
		app.quit();
	} // quitApp()
} // ElectronMain class 

// ElectronMain.This;
 
// ==================== Electron Event Handlers ====================
// --------- Prevent Multiple instances of Electron main process ---------
// https://stackoverflow.com/questions/35916158/how-to-prevent-multiple-instances-in-electron
if ( ! GotTheLock ) {
	konsola.log("! GotTheLock");
	ElectronMain.This.quitApp();
} 
else {
	app.on('second-instance', (event, commandLine, workingDirectory) => {
		// Someone tried to run a second instance, we should focus our window
		let main_window = ElectronMain.This.getMainWindow();
		
		if ( main_window != null ) {
			if ( main_window ) {
				 main_window.restore(); 
			}
			main_window.focus();
		}
	}); // Manage case of second instance
	
	// https://www.reddit.com/r/electronjs/comments/t151k8/what_is_the_difference_between_apponready_and/
	app.whenReady().then( () => {
		if (   process.platform.startsWith('win') 
			&& process.argv.length >= 2 ) {
			const in_file_path = process.argv[1];
		}
	 	ElectronMain.This.init(); // NB: calls 'createWindow'
	}); // 'ready' event handler
}
// --------- Prevent Multiple instances of Electron main process
// =====================================================================================

app.on('window-all-closed', () => {
  // konsola.log("*Event* 'window-all-closed' " + process.platform);	
  if (process.platform !== 'darwin') { 
	// ElectronMain.This().quitApp();
	let cmd_object = CommandRegistry.This.getCommand(APP_QUIT_CMD);
	cmd_object.run();
  }
}); // on 'window-all-closed' event