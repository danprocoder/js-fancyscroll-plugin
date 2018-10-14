<!DOCTYPE html>
<html>
	<head>
		<title>Chat</title>
		<script src="js/scroll-test.js"></script>
		<script>
		window.onload = function() {
			fancyscroll.init();
		}
		</script>
		<style>
		#side_chat {
			font-family: Arial;
			width: 250px;
			position: fixed;
			right: 5px;
			bottom: 5px;
			font-size: 12px;
		}

		#side_chat #top {
			padding: 8px;
			background: #3b5998;
			color: #ffffff;
		}

		#side_chat #online_list {
			height: 300px;
			border: 1px solid #dfdfdf;
			border-top: none;
		}

		#side_chat #online_list .scrollbar-container {
			right: 2px !important;
		}

		#side_chat #online_list .friend {
			border-bottom: 1px solid #efefef;
			height: 30px;
			line-height: 30px;
			padding: 5px;
		}

		#side_chat #online_list .friend img,
		#side_chat #online_list .friend > div {
			float: left;
		}

		#side_chat #online_list .friend img {
			width: 30px;
			height: 30px;
		}

		#side_chat #online_list .friend > div {
			margin-left: 5px;
		}
		</style>
	</head>
	<body>
		<div id="side_chat">
			<div id="top">Online friends</div>
			<div id="online_list" class="scroll-window scroll-vertical">
				<?php
				$names = array('Michael', 'John','Abel', 'Dean','Ola', 'James','Abbey', 'John','Michael', 'John','Michael', 'John','Michael', 'John','Michael', 'John','Michael', 'John','Michael', 'John','Michael', 'John','Michael', 'John','Michael', 'John','Michael', 'John','Michael', 'John','Michael', 'John','Michael', 'John','Michael', 'John','Michael', 'John','Michael', 'John','Michael', 'John','Michael', 'John','Michael', 'John','Michael', 'John','Michael', 'John','Michael', 'John','Michael', 'John','Michael', 'John','Michael', 'John','Michael', 'John','Michael', 'John','Michael', 'John','Michael', 'Zed',);
				foreach ($names as $n) {
					echo '<div class="friend">';
					echo '<img src="#" />';
					echo '<div>'.$n.'</div>';
					echo '</div>';	
				}
				?></div>
		</div>
	</body>
</html>
