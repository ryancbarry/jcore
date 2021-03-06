/*!
 This is a comment about FunctionName.
*/

(function(w, undefined) {

    //	var hashes = [];
    w.jCore = {};
    var config = {
        root: '',
        xdebug: false
    };

    w.jCore.config = function(options) {
        config = $.extend({}, config, options);
    };



    var syncedResources = {};

    var updateHash = function(uri) {
        var sample = ko.mapping.toJS(syncedResources[uri]);
        var json = JSON.stringify(sample.value);
        var valueWeight = json.length;

        // For sha256, the size of the hash should always be 64 (bytes).
        var hashWeight = 64;
        if (hashWeight < valueWeight) {
            // The hash of the resource value would be lighter than the actual value, so we'll cache it.
            var hash = hex_sha256(json);
            syncedResources[uri].hash = hash;
        //    console.log('JSON: '+json);
        //    console.log('Generated hash: '+hash);
        }
        else {
            // If the hash wouldn't be lighter than the actual value, we won't cache it.
            // We will discard whatever hash we have now, if any.
            if (typeof syncedResources[uri].hash !== 'undefined')
                delete syncedResources[uri].hash;
        }
    };

    w.jCore.sync = function(options) {
        var defaults = {
            write: false,
            init: {}
        };

        options = $.extend({}, defaults, options);

        var init = options.init;
        if (typeof init !== 'object')
            init = defaults.init;

        var sendPullRequest = function(uri) {
            var pullRequest = {};
            if (typeof uri === 'undefined') {
                // If a URI is not specified, we'll sync all resources.
                pullRequest = ko.mapping.toJS(syncedResources);

                $.each(pullRequest, function(i, val) {
                    if (typeof val.hash !== 'undefined') {
                        delete val.value;
                    }
                });

            //    console.log(pullRequest);
            }
            else {
                // If a URI is specified, we'll just sync its resource.
                pullRequest[uri] = ko.mapping.toJS(syncedResources[uri]);
                if (typeof pullRequest[uri].hash !== 'undefined') {
                    delete pullRequest[uri].value;
                }
            }

            var json = JSON.stringify(pullRequest);

            // The URI is required.
            var suffix = '';

            if (config.xdebug) {
                suffix = '?XDEBUG_PROFILE=1';
            }

            var url = config.root+'/ajax/'+suffix;
        //    console.log(url);

            $.ajax({
                url: url,
                type: 'POST',
                data: {
                    pull: json
                },
            //    datatype: "json",
            //    contentType: "application/json charset=utf-8",
                success: function(batchResponse) {
                    batchResponse = JSON.parse(batchResponse);
                //    console.log(batchResponse);

                    if (typeof batchResponse._ === 'undefined') {
                        $.each(batchResponse, function(uri, response) {
                            if (typeof response._ === 'undefined') {
                                var value = JSON.parse(response.value);
                                ko.mapping.fromJS(value, syncedResources[uri].value);

                                updateHash(uri);

                            //    console.log(ko.mapping.toJS(syncedResources));
                            }
                            else if (response._ === 0) {
                                // Server is saying we're in sync.
                                // Nothing needs to be done.
                            //    console.log(ko.mapping.toJS(syncedResources));
                            }
                            else {
                                var err = new Error();
                                err.name = 'Error ' + response._;
                                err.message = batchResponse.desc;
                                throw (err);
                            }
                        });
                    }
                    else {
                        var err = new Error();
                        err.name = 'Error ' + batchResponse._;
                        err.message = batchResponse.desc;
                        throw (err);
                    }
                }
            });
        };

        var resource = ko.mapping.fromJS(options.init);
        if (typeof options.uri !== 'undefined') {

            // Ensures that we're not already syncing this resource.
            // Not sure it's a good idea to mirror a resource multiple times (for performance
            // reasons), so we'll just throw an error.
            //
            if (typeof syncedResources[options.uri] !== 'undefined') {
                throw('"'+options.uri+'" is being synced more than once');
            }

            syncedResources[options.uri] = {
                value: resource
            //  hash: ''
            };

            updateHash(options.uri);
            sendPullRequest(options.uri);

            if (Object.keys(syncedResources).length === 1) {
                // We've added the first resource to the sync list, so
                // we should start syncing it.
                setInterval(sendPullRequest, 5000);
            }
        }
        else {
			throw('URI not specified');
        }

        return resource;
    };
})(window);