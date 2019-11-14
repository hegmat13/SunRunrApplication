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

				
		// Get html for displaying items
		}
		else if($action == "getItems"){
			// Get the tables describing the items
			$items = $dba->getItems();
			// Return the array for now
			echo json_encode($items);

			// ... Build the html

		// Get the user's shopping cart
		}else if($action == "getItem"){
			if (ISSET($_GET['id'])) {
				$item = $dba->getItem($_GET['id']);
				echo json_encode($item);
			}

		// Get the user's shopping cart
		}  else if($action == "getShoppingCart"){
			// Get the current user
			$userId = $_SESSION["id"];

			// Call for the shopping cart
			$items = $dba->getUserCart($userId);
			
			// Return the array for now
			echo json_encode($items);

			// ... Build the HTML	

		// Get a user's purchases
		} else if($action == "getPurchases"){
			// Get the current user
			$userId = $_SESSION["user"];
		
			// Call for the purchases
			$items = $dba->getUserPurchases($userId);

			// Return the array for now
			echo json_encode($items);
				
			// ... Build the HTML	

		// Move items from shopping cart to purchases
		} else if($action == "checkout"){
			// Get the current user
			$userId = $_SESSION["id"];
			
			// Call for the checkout
			echo json_encode($dba->checkout($userId));
		} else if($action == "getReviews"){
			$id= $_GET["id"];

			$i = 0;
			$reviews = $dba->getReviews($id);
			foreach ($reviews as $review){
				if(isset($_SESSION["user"])){
					if(strcasecmp($_SESSION["user"], $review["email"]) == 0){
						$reviews[$i]["Deletable"] = "True";
					}
					else{
						$reviews[$i]["Deletable"] = "False";
					}
				}
				else{
					$reviews[$i]["Deletable"] = "False";
				}
				$i++;
			}
			echo json_encode($reviews);
		} else if($action == "addReview"){
			$itemId= $_GET["itemID"];
			$review= $_GET["review"];

			$dba->addReview($itemId, $review);
		} else if ($action == "logout"){

				// remove all session variables
				session_unset(); 
				// destroy the session 
				session_destroy(); 
		} else if($action == "deleteReview"){
			$dba->deleteReview($_GET['reviewID']);
			echo json_encode("True");


		}else if ($action == "addtoCart"){
			if(isset($_SESSION['id'])){

				$item = $_GET['itemID'];
				$quantity = $_GET['quantity'];
				$userID = $_SESSION['id'];
				$dba->addtoCart($userID, $item, $quantity);
			}

		}elseif ($action == "getReceipt")
		{
			if(isset($_GET['purchaseID'])){
				$purchaseID = $_GET['purchaseID'];
				$returnArr = array("user" => $_SESSION["user"],"purchase" => $dba->getPurchase($purchaseID));
				echo json_encode($returnArr);
			}
		}
	}
?>
