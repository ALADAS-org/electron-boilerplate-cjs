// ========================================================================================================
// =========================================     html_utils.js     ========================================
// ========================================================================================================
"use strict";


class HtmlUtils {
	// https://gist.github.com/mredmundto/8e4fd7413b42aa58142fca80516c7997
	static GetElementsByClassName(node, class_name) {
		let node_id  = "";
		let node_tag = "";
		if (node != undefined) {
			if (node.id !=undefined) node_id  = node.id;
			
			if (node.tagName != undefined) node_tag = node.tagName;
			else return [];
		}
		else return [];
 
		// konsola.msg( "> GetElementsByClassNamesearch class:" + class_name + " " + node_id + " " + node_tag);
		
		let matches = [];

		// get all classNames of node
		let node_class_names = "";
		// konsola.msg( "> GetElementsByClassName node.className: '" + node.className + "'");
		if (node.className != '' && node.className != undefined) {
			node_class_names = node.className.split(" ");
		}
		  
		// push node if node has 'class_name' in 'class_names'
		// konsola.msg( "   node_class_names: '" + node_class_names + "' " + node_class_names.indexOf(class_name));
		node_class_names.indexOf(class_name) >= 0 ? matches.push(node) : null;

		// if node has children, recurse
		// konsola.msg( "   node.children.length: " + node.children.length);
		if (node.children.length > 0) {
			for (let i = 0; i < node.children.length; i++) {
				// add matching elements for this recursion frame
				matches = matches.concat(HtmlUtils.GetElementsByClassName(node.children[i], class_name));
			}
		}

		return matches;
	} // HtmlUtils.GetElementsByClassName()		
		
	// https://stackoverflow.com/questions/2155737/remove-css-class-from-element-with-javascript-no-jquery
	static HasClass(node, class_name) {
		konsola.msg(">> HtmlUtils.HasClass");
		if (node == undefined) { 
		    return false;
		}		
		
		if (node.classList != null) {
			konsola.msg("   classList: " + JSON.stringify(node.classList));
			return node.classList.contains(class_name);
		} 
		else {
			if ( node.className != undefined) {
				return (-1 < node.className.indexOf(class_name));
			}
		}
		return false;
	} // HtmlUtils.HasClass()
	
	static AddClass(node, class_name) {
		// konsola.msg(">> HtmlUtils.AddClass elt_id:" + elt_id);
		if (node == undefined) { 
		    return;
		}
		// onsola.msg("   node.id:" + node.id + " node.classList: " + node.classList);
		
		if (node.classList != null) {
			node.classList.add(class_name);
		} else if (! HtmlUtils.HasClass(node, class_name)) {
			let classes = node.className.split(" ");
			classes.push(class_name);
			node.className = classes.join(" ");
		}
		return node;
	} // HtmlUtils.AddClass()
	
	static RemoveClass(node, class_name) {
		// konsola.msg(">> HtmlUtils.RemoveClass elt_id:" + elt_id);
		if (node == undefined) { 
		    return;
		}
		// konsola.msg("   node.id:" + node.id + " node.classList: " + node.classList);
		
		if (node.classList != null) {
			node.classList.remove(class_name);
		} else {
			let classes = node.className.split(" ");
			classes.splice(classes.indexOf(class_name), 1);
			node.className = classes.join(" ");
		}
		return node;
	} // HtmlUtils.RemoveClass()
	
	static ToggleNodeVisibility( node ) {
		// konsola.msg(">> HtmlUtils.ToggleNodeVisibility elt_id: " + elt_id);
	  
		if (node == undefined) { 
		    // konsola.msg(">> " + _RED_ + elt_id + " NOT DEFINED");
		    return;
		}
		
		// node.hidden = true;
        // $("#" + elt_id).hide();
		
		node.hidden = !node.hidden;
	} // HtmlUtils.ToggleNodeVisibility()
	
	static HideNode( node ) {
		// konsola.msg(">> HtmlUtils.HideNode elt_id: " + elt_id);
	  
		if (node == undefined) { 
		    // konsola.msg(">> " + _RED_ + elt_id + " NOT DEFINED");
		    return;
		}
		
		// node.hidden = true;
        // $("#" + elt_id).hide();
		
		// if (! node.hidden) !node.hidden;
		node.hidden = true;
        	
        //$('#' + elt_id).prop("style", "display:none");		
	} // HtmlUtils.HideNode()
	
	static ShowNode( node ) {
		//konsola.msg(">> HtmlUtils.ShowNode elt_id: " + elt_id);
		if (node == undefined) { 
		    return;
		}
		
		node.hidden = false; 
		// if (node.hidden) !node.hidden;
		// $("#" + node_id).show();	
	} // HtmlUtils.ShowNode()
	
	static GetElement( elt_id ) {
		let elt = document.getElementById(elt_id);
		if (elt != undefined) { return elt; }
		return undefined;
	} // HtmlUtils.GetElement()
	
	static InitializeNode( elt, values, labels ) {
		// konsola.msg( pretty_func_header_format( "HtmlUtils.InitializeNode", " elt_id: " + elt_id ) );
		if (elt != undefined) { 
		    //trace2Main("   elt.nodeName: " + elt.nodeName);
			if ( elt.nodeName == "SELECT" ) {	
				if (   Array.isArray(values) 
					&& Array.isArray(labels)
                    && values.length == labels.length	) {
						$("#" + elt_id).empty();
						for ( let i=0; i < values.length; i++ ) {
							//trace2Main("   values[" + i +"]: " + values[i]);							
							elt.add(new Option(values[i], values[i]));
						}
				}					
			}
		}
		// trace2Main( pretty_func_header_format( "<END> HtmlUtils.InitializeNode", " elt_id: " + elt_id ) );
	} // HtmlUtils.InitializeNode()
	
	static GetValue( node ) {
		// konsola.msg( pretty_func_header_format( "HtmlUtils.GetNodeValue() ", elt_id ));     		
		if ( node != undefined ) { 
			if ( node.nodeName == "TD" || node.nodeName == "SPAN" || node.nodeName == "DIV" ) {
				return node.textContent;
			}
			else {
				return node.value;
			}	
		}
		return "Null_String";
	} // HtmlUtils.GetValue()	

	static SetValue( node, value_str ) {
		// trace2Main(">> " + _CYAN_ + "HtmlUtils.SetNodeValue() " + _END_ + elt_id);
		// konsola.msg("> HtmlUtils.SetValue");
		
		if ( node != undefined ) {
            //trace2Main(" node.nodeName: " + node.nodeName);			
			if (   node.nodeName == "TD" 
			    || node.nodeName == "SPAN" || node.nodeName == "DIV" 
				|| node.nodeName == "BUTTON" ) {
				node.textContent = value_str;
			}
			else if (   node.nodeName == "TEXTAREA" ) {
                // **PB** value change seems asynchronous 
                // https://stackoverflow.com/questions/47240315/how-to-update-input-from-a-programmatically-set-textarea 				
                // https://www.geeksforgeeks.org/jquery-set-the-value-of-an-input-text-field/
				// ** Fix **: set value via JQuery and NOT with 'elt.value = value_str'
				// => $('#' + elt_id).prop("value", value_str);
				let node_id = node.id; 
				$('#' + node_id).prop("value", value_str);
			}
			else {
				//trace2Main(" elt.value: '" + value_str + "'");
				node.value = value_str;
			}	
		}
	} // HtmlUtils.SetValue()
} // HtmlUtils class