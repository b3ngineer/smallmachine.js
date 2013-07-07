;(function(sm) {
    sm.addHelper('json', function(url, asyncResult){
        if (typeof jQuery !== 'undefined') {
            try {
                jQuery.ajax({
                    dataType: 'json',
                    url: url,
                    type : 'GET',
                    success: function(data, textStatus, jqxhr) {
                        sm.messenger.success.publish(textStatus);
                        asyncResult.publish(data);
                    },
                    error: function(jqxhr, textStatus, thrown) {
                        sm.messenger.error.publish(thrown);
                    }
                }); 
            }
            catch (error) {
                throw new error(error);
            }
        }

        return asyncResult;
    });
}(sm));
