(function(a){a.jCore=function(){};a.jCore.synchronize=function(a,b,c){b=b();b.synchronize=function(){$.ajax(a,{success:function(a){a=JSON.parse(a);c(a)}});return this};return b.synchronize()}})(window);
