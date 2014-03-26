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
				
		// Only load on /publish/static-pages/ [this should be a variable]
		if ($page->_context['section_handle'] == 'pages' && $page->_context['page'] == 'index') {
			$page->addStylesheetToHead($assets_path . '/admin.css', 'all', $LOAD_NUMBER++);
			$page->addScriptToHead($assets_path . '/js/pages.js', $LOAD_NUMBER++);
			// Effectively disable backend pagination for this section
			// Symphony::Configuration()->set("pagination_maximum_rows", $LOAD_NUMBER++, "symphony");
		}
		// Only load on /publish/.../new/ OR /publish/.../edit/
		if (in_array($page->_context['page'], array('new', 'edit'))) {
			$page->addScriptToHead($assets_path . '/js/publish.js', $LOAD_NUMBER++);
		}
		
	}
		
	//todo add setting to choose the section & the title.
  
}  
?>