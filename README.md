README
======

Introduction
------------

The jCore resource syncronization system.

Makes use of the following technologies:
* Redis 2.4.14
* PHP 5.3.10
* JSON 3
* jQuery 1.7.2
* Knockout 2.1.0 / Knockout Mapping (optional)

Installation
------------

1. Place this project in your web root.

That's it. No, really. 

Example (prototype)
-------------------

	self.resource = jCore.synchronize('/jcore/ajax/?res=/hello-world', function() {
		// Create function
		return ko.observable();
	}, function(data) {
		// Update function
		if (data.error === 0) {
			self.resource(data.value);
		}
	});

	// Schedules the model to sync regularly.
	setInterval(self.resource.synchronize, 1000);

