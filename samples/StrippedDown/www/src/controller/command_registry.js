// =====================================================================================
// ==============================   command_registry.js   ==============================
// =====================================================================================
"use strict";

// konsola.log("CommandRegistry");

const { app } = require('electron');
const { konsola } = require( app.getAppPath() + '/www/src/utils/log/konsola.js');

// https://www.linkedin.com/pulse/interfaces-javascript-es6-alexey-savchenko-h825f/ 
const { AbstractCommand } = require( app.getAppPath() + '/www/src/controller/commands/abstract_command.js');
const { NullCmd }         = require( app.getAppPath() + '/www/src/controller/commands/null_cmd.js');

const fs   = require('fs');
const path = require('path');

class CommandRegistry {
	static #_Key = Symbol();
	static #_Singleton = new CommandRegistry( this.#_Key );
	static #_InstanceCount = 0;
	
	static Initialized = false;

    // ** Private constructor **
	constructor( key ) {
		// konsola.log('>> new CommandRegistry (Singleton)');
		if ( key !== CommandRegistry.#_Key ) {
			throw new TypeError("'CommandRegistry' constructor is private");
		}
		this.commands = {};
	} // ** Private constructor ** 'Singleton' design pattern
	
	register( key, cmd_object ) {
		konsola.msg('> CommandRegistry.register() key: ' + key);
		if (! (cmd_object instanceof AbstractCommand) ) { 
			throw new TypeError("'cmd_object' is not an instance of 'AbstractCommand'");	
        }	
		
		if (key != "" && key != undefined && key != null) {
			this.commands[key] = cmd_object;
		}
	} // register()
	
	getCommand( key ) {
		// konsola.log('>> CommandRegistry.getCommand() key:' + key);
		if (this.commands[key] != undefined) {
			return this.commands[key];
		}
		return NullCmd.This;
	} // getCommand()
	
	getCommandInfos( key ) {
		// konsola.log('>> CommandRegistry.getCommandInfo()');
		if (this.commands[key] != undefined) {
			let cmd_object = this.commands[key];
			return cmd_object.getInformations();
		}
		return {};
	} // getCommandInfos()
	
	getKeys() {
		return Object.keys(this.commands);
	} // getKeys()
	
	static Init(electron_main) {
		if (CommandRegistry.Initialized) return;
		
		konsola.resetLevel();
		
		this.electron_main = electron_main;
				
		// Register all commands
		// https://stackoverflow.com/questions/5364928/node-js-require-all-files-in-a-folder
		// konsola.log("CommandRegistry.Init");
		let normalized_path = path.join(__dirname, "commands");
		// konsola.log("normalized_path: " + normalized_path.toString());

		let cmd_path      = undefined;
		let object_name   = undefined;
		let module_holder = {};

		fs.readdirSync(normalized_path).forEach(function(file) {
			// konsola.log("> file: '" + file.toString() + "'");
			if (   file.toString() != 'abstract_command.js' 
			    && file.toString() != 'null_cmd.js'
				&& file.toString() != 'dummy_cmd.js') {
		        // konsola.log("   require file: " + file.toString());
		        cmd_path =  __dirname + "/commands/" + file.toString();
		        // konsola.log("   path: " + cmd_path);

		        object_name = file.replace('.js', '');
		        // konsola.log("   object_name: " + object_name);

		        module_holder = require(cmd_path)(module_holder);
		    }	
		}); // require all commands
		
		let cmd_keys = Object.keys(module_holder);
		// konsola.msg("   cmd_keys: " + JSON.stringify(cmd_keys));
		
		for (let i=0; i < cmd_keys.length; i++) {
			let cmd_key = cmd_keys[i];
			// konsola.log("   cmd_key[" + i + "]: " + cmd_key);
			let cmd_object = module_holder[cmd_key];		
			this.#_Singleton.register(cmd_key, cmd_object);
			cmd_object.setElectronMain(this.electron_main);
		}
		
		CommandRegistry.Initialized = true;
	} // CommandRegistry.Init()
	
	static get This() {
		// konsola.log('>> CommandRegistry.This() ' + CommandRegistry.#_Singleton);
		if ( CommandRegistry.#_Singleton == undefined ) {
			konsola.log('** CommandRegistry.#_Singleton undefined **');
			this.#_Singleton = new CommandRegistry();
			if (this.#_InstanceCount > 0) {
				throw new TypeError("CommandRegistry constructor called more than once.");
			}
			this.#_InstanceCount++;
        }
		
        return CommandRegistry.#_Singleton;
    } // CommandRegistry get This	
} // CommandRegistry class

function test_register() {
	konsola.log('*** CommandRegistry register test ***');
	let cmd_registry = CommandRegistry.This;
	
	let dummy_klass = class {};
	let dummy_obj = new dummy_klass();
	
	cmd_registry.register("dummy_obj", dummy_obj); // Must Raise Exception
} // test_register()

function test_delegation() {
	konsola.log('*** CommandRegistry Delagation test ***');
	let cmd_registry = CommandRegistry.This();
 	
	let dummy_cmd_obj = cmd_registry.getCommand('DummyCmd'); 
	konsola.info('> 1 Before delegation');
	dummy_cmd_obj.run();
	
	let dummy_klass = class {};
	let dummy_obj = new dummy_klass();
	
	// set delegate to 'HelpAboutCmd' instance
	let help_about_cmd_obj = cmd_registry.getCommand('HelpAboutCmd');
	
	// NB: checked "delegator_cmd_obj.setDelegate(dummy_obj);": Raises exception
	dummy_cmd_obj.setDelegate(dummy_obj); // ": Raises exception
	dummy_cmd_obj.setDelegate(help_about_cmd_obj);
	
	konsola.info('> 2 After delegation');
	dummy_cmd_obj.run();
} // test_delegation()

// NB: 'test_delegation' checked
// test_delegation();

// NB: 'test_register' checked
// test_register();

// NB: checked: 'let cmd_registry = new CommandRegistry();' raises Exception
CommandRegistry.This;

exports.CommandRegistry = CommandRegistry


