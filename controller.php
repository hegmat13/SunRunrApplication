<?php
	// Get the database adapter
	include 'DatabaseAdapter.php';
	// Start the session
	session_start();
	if(isset($_GET["action"])){
		$action = $_GET["action"];

		// Register
		if($action == "register"){
			if(isset($_GET['email']) and isset($_GET['password']) and isset($_GET['zipcode'])){

				// Get the passed parameters		
				$email = $_GET["email"];
				$password = $_GET["password"];
				$zipcode = $_GET["zipcode"];
				
				// remove all session variables
				session_unset(); 
				// destroy the session 
				session_destroy(); 
				session_start();
				$results = $dba->register($email, $password, $zipcode);
				$dba->validate($email, $password);
				// Ask the database to create the user
				echo json_encode($results);
			}
			else{
				echo json_encode("Failed registration");
			}
		// Login
		}
		else if($action == "login"){
			if(isset($_GET['email']) and isset($_GET['password'])){

				// remove all session variables
				session_unset(); 
				// destroy the session 
				session_destroy(); 
				session_start();
				// Get the passed parameters
				$email = $_GET["email"];
				$password = $_GET["password"];

				// Ask the database to confirm
				$valid = $dba->validate($email, $password);
				echo json_encode($valid);	
			}
			else{
				echo json_encode("Failed login");
			}
		}else if ($action == "logout"){

				// remove all session variables
				session_unset(); 
				// destroy the session 
				session_destroy(); 
		}
	}
?>
