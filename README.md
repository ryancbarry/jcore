README
======

Introduction
------------

The jCore resource syncronization system.

Requires the following technologies:
* Redis 2.4.14
* PHP 5.3.10
* JSON 3
* jQuery 1.7.2

Optional:
* Knockout 2.1.0 / Knockout Mapping 

Installation
------------

1. Place this project in your web root.

That's it. No, really. 

Example (prototype)
-------------------

Note: jCore is designed to "play nice" with Knockout, but is not tightly coupled to it.

	self.resource = jCore.synchronize('/jcore/ajax/?res=/hello-world', function() {
		// Create function
		return ko.observable();
	}, function(value) {
		// Update function
		self.resource(value);
	});

	// Schedules the model to sync regularly.
	setInterval(self.resource.synchronize, 1000);

