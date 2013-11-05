function string_to_slug(str) {
  str = str.replace(/^\s+|\s+$/g, ''); // trim
  str = str.toLowerCase();
  
  // remove accents, swap ñ for n, etc
  var from = "àáäâèéëêìíïîòóöôùúüûñç·/_,:;";
  var to   = "aaaaeeeeiiiioooouuuunc------";
  for (var i=0, l=from.length ; i<l ; i++) {
    str = str.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
  }

  str = str.replace(/[^a-z0-9 -]/g, '') // remove invalid chars
    .replace(/\s+/g, '-') // collapse whitespace and replace by -
    .replace(/-+/g, '-'); // collapse dashes

  return str;
}

jQuery(document).ready(function () {
	try {			
		// Auto generate slugs
		var fields = ['title'];
		var hasHandle = jQuery('input[name="fields[url-handle][en]"]').length;
		if (hasHandle > 0){
			for (var ix_f in fields) {
				for (var ix_l in Symphony.Languages) {
					var field = fields[ix_f];
					var lang = Symphony.Languages[ix_l];
					
					// Create button
					var btn = jQuery('<img />')
						.attr('src', Symphony.Context.get('root')+'/extensions/section_hierarchy/assets/images/copy_slug.png')
						.attr('lang', lang)
						.attr('class', 'sym_url_handle')
						.css({'cursor':'pointer'})
						.click(function(){
							var input = jQuery(this).prev();
							var lang2 = jQuery(this).attr('lang');
							
							var dst_name = 'fields[url-handle]['+lang2+']';
							jQuery('input[name="'+dst_name+'"]').val(string_to_slug(input.val()));
						});
					
					// Insert after field
					var inputname = 'fields['+field+']['+lang+']';
					var input = jQuery('input[name="'+inputname+'"]');
					input.css({ 'width':'95%', 'margin-right':'5px'}).after(btn);
				} 
			}
		}
	} catch (e) {}
});