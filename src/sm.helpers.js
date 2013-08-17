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
                sm.messenger.error.publish(error);
            }
        }
		else {
			var xhr = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject('MSXML2.XMLHTTP.3.0');
			xhr.onprogress = function() {};
			xhr.onerror = {};
			xhr.onreadystatechange = function() {
				if (xhr.readyState < 4) return;
				if (xhr.status == 200) {
					sm.messenger.success.publish(xhr.statusText);
					asyncResult.publish(JSON.parse(xhr.responseText));
				}
				else {
					sm.messenger.error.publish(xhr.statusText);
				}
			}
			xhr.open("GET", url, true);
			xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
			xhr.setRequestHeader("Content-type", "application/json");
			xhr.send(null);
		}
        return asyncResult;
    });
}(sm));
