<?php

class extension_section_hierarchy extends Extension {

	
	public function getSubscribedDelegates() {
		return array(
			array(
				'page' => '/backend/',
				'delegate' => 'InitialiseAdminPageHead',
				'callback' => 'initializeAdmin',
			),
		);
	}
	
	/**
	 * Some admin customisations
	 */
	public function initializeAdmin($context) {
		$LOAD_NUMBER = 935935299;

		$page = Administration::instance()->Page;
		$assets_path = URL . '/extensions/section_hierarchy/assets';

		$hierarchy = Symphony::Configuration()->get('section_hierarchy');
		$sections = array_keys($hierarchy);
				
		// Only load on /publish/static-pages/ [this should be a variable]
		if ( in_array($page->_context['section_handle'] , $sections) && $page->_context['page'] == 'index') {

			Administration::instance()->Page->addElementToHead(
				new XMLElement('script', 'Symphony.Hierarchy='.json_encode($hierarchy[$page->_context['section_handle']]), array(
					'type' => 'text/javascript'
				))
			);

			$page->addStylesheetToHead($assets_path . '/admin.css', 'all', $LOAD_NUMBER++);
			$page->addScriptToHead($assets_path . '/js/pages.js', $LOAD_NUMBER++);
			// Effectively disable backend pagination for this section
			// Symphony::Configuration()->set("pagination_maximum_rows", $LOAD_NUMBER++, "symphony");
		}
		
	}
		
	//todo add preferences page to add the settings for now use the below for a guide on what needs to be added within the config

	/*
		###### SECTION_HIERARCHY ######
		'section_hierarchy' => array(
			'sections' => array(
					'title' => '7',
					'parent' => '17',
					'filters' => array(
							'type' => 'Article Section'
						)
				),
			'pages' => array(
					'title' => '74',
					'parent' => '77'
				)
		),
		########
	*/
  
}  
?>