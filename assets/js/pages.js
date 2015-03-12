/**
 * This script has become a bit inefficient (3 separate loops over the same data!) but so what, it's jsut the admin section.
 * A few extra seconds won't hurt anyone.
 */
jQuery(document).ready(function () {
	try {

		filters = Symphony.Context.get('env').filters;

		if (typeof(Symphony.Hierarchy.filters) !== 'undefined'){
			//filter will run if the two filters have matching keys. Not actual values at least for now
			currentKeys = Object.keys(filters);
			supportedKeys = Object.keys(Symphony.Hierarchy.filters);

			if (!(jQuery(currentKeys).not(supportedKeys).length === 0 && jQuery(supportedKeys).not(currentKeys).length === 0))
				return;

		} else if (typeof(filters) != 'undefined' && Object.keys(filters).length > 0)
			return;

		//if parent values are all null do not try to parse as there are no elements to indent
		if (jQuery('.field-' + Symphony.Hierarchy.parent).not('.inactive').length == 0)
			return;
	
		// Function for scraping the inside content of a cell (possibly containing a child node)
		function getInner(node) {
			return ((node.children.length > 0) ? ((node.children[0].children.length > 0) ? node.children[0].children[0].innerHTML : node.children[0].innerHTML) : node.innerHTML).trim();
		}
		// Get the page ID
		function getID(node) {
			var a = jQuery(node).find('a');
			if (a.attr('href')) {
				var match = a.attr('href').match(/edit\/(\d+)/);
				return parseInt(match[1]);
			} else {
				return 0;
			}
		}
		
		// Get hold of table & give it a class
		var table = jQuery('table')[0];
		jQuery(table).attr('id', 'publish-pages-table');
		
		// Get column indexes of: "Menu title", "Parent page"
		var header_row = table.rows[0];
		var cols = new Array();
		cols['parent'] = jQuery(header_row.cells).filter('#field-' + Symphony.Hierarchy.parent).index();
		cols['title'] = jQuery(header_row.cells).filter('#field-' + Symphony.Hierarchy.title).index();
		
		// Make sure all columns found
		if (jQuery.inArray(cols, -1) !== -1)
			return;

		//
		// Loop 1: Get a list of everybody's parents (used later)
		//
		
		var parents = [];
		for (var i = 1; i < table.rows.length; i++) {
			// Get hold of stuff
			var row = table.rows[i];
			var page_id = getID(row.cells[cols['title']]);
			var parent_id = getID(row.cells[cols['parent']]);
			
			// Give ID to entire row
			row.id = page_id;
			
			// Insert into flat parents list
			parents[page_id] = parent_id;
		}
		
		// ====================================================================
		
		// Determine depth of any page
		function getDepth(page_id) {
			if(!page_id || page_id < 1) return 0;
			console.log(page_id);
			var depth = 0;
			var parent_id = parents[page_id];
			while (parent_id != 0 && depth < 3) {
				console.log(depth);
				depth++;
				parent_id = parents[parent_id];
			}
			return depth;
		}
		
		//
		// Loop 2: Put orphans under their correct parents
		//
		var parent_stack = [];
		for (var i = 1; i < table.rows.length; i++) {
			// Get hold of things
			var row = table.rows[i];
			var cell = row.cells[cols['title']];
			var page_id = parseInt(jQuery(row).attr('id'));
			var parent_id = parents[page_id];
		
			// Indent according to depth
			var page_depth = getDepth(page_id);
			jQuery(cell).addClass('depth-'+page_depth);
			
			// Try and ensure all kids appear under their proper parents
			parent_stack[page_depth] = page_id;
			parent_stack = parent_stack.slice(0, page_depth+1);
			if ((page_depth > 0) && (parent_id != parent_stack[parent_stack.length-2])) {
				var jrow = jQuery(row);
				jrow
					.addClass('highlight')
					.insertAfter( jQuery(table).find('tr#'+parent_id) );
				alert('Page "'+getInner(cell)+'" has been automatically moved, please confirm its positon by reordering some items.');
				jQuery('html, body').animate({scrollTop: jrow.offset().top - 100}, 500);
			}
		
		}
		
		// ====================================================================

		// Get all direct CHILDREN of a parent
		function getChildren(page_id) {
			var children = [];
			var pos = 0;
			var i = -1;
			while (pos != -1) {
				if ( (pos = parents.indexOf(page_id, i+1)) > -1) {
					children.push(pos);
					i = pos;
				}
			}
			return children;
		}
		
		// Shortcuts for workshorse below
		function hideChildren(page_id) { _processChildren(page_id, 'hide', 0); }
		function showChildren(page_id) { _processChildren(page_id, 'show', 0); }
		// Called recursively!
		function _processChildren(page_id, action, depth) {
			// If any children, then hide those
			var children = getChildren(page_id);
			for(var i in children) {
				_processChildren(children[i], action, depth+1);
			}
			// Perform the action (except at first level)
			if (depth > 0) {
				if (action == 'hide')
					jQuery('tr#'+page_id).hide();
				else
					jQuery('tr#'+page_id).show();
			}
			// Toggle the toggler
			if (action == 'hide')
				jQuery('tr#'+page_id+' a.toggle').removeClass('open').addClass('closed');
			else
				jQuery('tr#'+page_id+' a.toggle').addClass('open').removeClass('closed');
		}
		
		// Re-color rows
		function recolorRows() {
			jQuery('table:first tr').removeClass('odd');
			jQuery('table:first tr:visible').each(function(idx){
				if (idx % 2)
					jQuery(this).addClass('odd');
			});
		}
		
		//
		// Loop 3: Do all remaining processing
		// 	- Highlight duplicate URL Handles
		//	- Add folding stuff
		//
		var handle_map = [];
		for (var i = 1; i < table.rows.length; i++) {
			// Get hold of things
			var row = table.rows[i];
			var cell = row.cells[cols['title']];
			var page_id = parseInt(jQuery(row).attr('id'));
			var parent_id = parents[page_id];
			
			// If it has no kids just put a spacer...
			if (getChildren(page_id).length <= 0) {
				jQuery(cell).prepend('<span class="mdash">&nbsp;</span>');
				continue;
			}

			// ...else, Add fold/collapse button
			var toggler = jQuery('<a />').addClass('toggle open').click(function(){
				var toggler = jQuery(this);
				var my_id = parseInt(toggler.parent().parent().attr('id'));
				if (my_id > 0){
					if (toggler.hasClass('open'))
						hideChildren(my_id);
					else
						showChildren(my_id);
					recolorRows();
				}
			});
			jQuery(cell).prepend(toggler);
			
		}
				
		// Finally add an overall show/hide button
		jQuery('<button />')
			.addClass('toggle')
			.text('Fold all')
			.click(function(){
				jQuery(getChildren(0)).each(function(){
					hideChildren(parseInt(this));
					}
				);
				recolorRows();
				return false;
			}).insertBefore(jQuery(table));
		jQuery('<button />')
			.addClass('toggle')
			.text('Expand all')
			.click(function(){
				jQuery(getChildren(0)).each(function(){
					showChildren(parseInt(this));
					}
				);
				recolorRows();
				return false;
			}).insertBefore(jQuery(table));
	} catch (e) {}
});