section-hierarchy
=================

This extension works whowever it is not 100% idiot proof at the moment so you're going to have to edit the config and know the field Id's to get it to work.

1. Install the Extension

2. Add this snippet in your config file


	###### SECTION_HIERARCHY ######
	'section_hierarchy' => array(
		'pages' => '{
				\'title\':\'74\',
				\'parent\':\'77\'
			}',
	),
	########


3. Replace `pages` with the section name that you would like to use section_hierarchy on

4. Replace the `title` and `parent` values with the respective Field ID's. Note that the field names need not match title and parent, but a title refers to the key/first field you'd usually have in the table. It is mainly used to edit for indenting. And parents is used to identify the parent field and set it as a child of a parent section.

5. If you need for more then one section copy the `pages` block and repeat steps 2/3 as many times as needed