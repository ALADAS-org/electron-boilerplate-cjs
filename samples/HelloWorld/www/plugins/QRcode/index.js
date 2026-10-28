// https://github.com/dutchigor/pluggable-electron/wiki#examples
// https://github.com/dutchigor/pluggable-electron-demo/tree/main

// Register all the above functions and objects with the relevant extension points
export function init (extensionPoints) {
	console.msg("SamplePlugin init()");
	
	// Mock function for adding a menu item
	const SamplePlugin = (varFromExtensionPoint) => {
      // your extension code here.
      // varFromExtensionPoint is provided as a parameter when the extension point is executed;
      // purchaseMenu in the example above.
	}

	// Register to purchase_menu extension point
	// extensionPoints.register( 'purchase_menu', 'extension-name', SamplePlugin )
} // SamplePlugin init()