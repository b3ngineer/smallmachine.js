;(function(sm) {
    sm.addHelper('json', function(url){
        if (typeof jQuery !== 'undefined') {
            try {
                jQuery.ajax({
                    dataType: 'json',
                    url: url,
                    type : 'GET',
                    success: function(data, text, jqxhr) {
                        console.log('success');
                    },
                    error: function(jqxhr, text, thrown) {
                        console.log(jqxhr);
                        console.log(text);
                        console.log(thrown);
                    }
                }); 
            }
            catch (error) {
                throw new error(error);
            }
        }
    });
}(sm));
