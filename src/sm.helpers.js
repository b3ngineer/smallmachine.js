;(function(sm) {
    sm.addHelper('json', function(url){
        if (typeof jQuery !== 'undefined') {
            try {
                jQuery.ajax({
                    dataType: 'json',
                    contentType: 'application/x-www-form-urlencoded',
                    url: url,
                    data: {
                        blob: {wob:"1",job:"2", ar:[1,2,{a:'b'}]}
                    },
                    type : 'POST',
                    success: function(data, text, jqXHR) {
                        console.log('success');
                    },
                    error: function(jqXHR, text, thrown) {
                        console.log(jqXHR);
                        console.log(text);
                        console.log(thrown);
                    }
                }); 
            }
            catch (error) {
                throw new Error(error);
            }
        }
    });
}(sm));
