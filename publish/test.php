<?


// Sets up a comment form.
//

class CommentForm extends FunctionChain {
    public function __construct() {
        parent::__construct(array(
			function($chain) {
				?>
				<div class="container">
					<?php $chain->next(); ?>
				</div>
				<?php
			},
			function($chain) {
				?>
				<div class="main">
					<?php $chain->next(); ?>
				</div>
				<?php
			},
			function($chain) {
				?>
				<div class="body-content">
					<?php $chain->next(); ?>
				</div>
				<?php
			}
		));
    }
}



//$commentForm = new CommentForm();



/*
// Changing just one link in the chain.
$commentForm->chain[1] = function($chain) {
	// Nested function chains.
	$title = new InlineText();

	// Overriding the defaults.
	//
	$title->className = function($chain) {
		echo 'custom-class-name';
	};

	$title->text = function($chain) {
		echo '[custom text]';
	};

	?>
	<div class="title"><?php $title->run(); ?></div>
	<div class="body"><?php $chain->next(); ?></div>
	<div class="footer"></div>
	<?php

};
*/

//$commentForm->run();
