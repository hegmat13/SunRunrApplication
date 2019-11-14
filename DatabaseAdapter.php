<?php
// This gives an error
// session_start();

class DatabaseAdapter{
	// Reference to the database connection
	private $DB;

	// Connect to the shoppomg database
	public function __construct() {
		$dataBase ='mysql:dbname=shopping; charset=utf8; host=127.0.0.1';
		$user = 'root';
		$password = '';

		try {
			$this->DB = new PDO($dataBase, $user, $password);
			$this->DB->setAttribute ( PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION );
		} catch (PDOException $e) {
			echo('Error establishing Connection');
			exit();
		}
	}
	

	// Get all items with the query: select * from item
	public function getItems(){
		// Build the query
		$query = 'select * from item';
		
		// Execute and return the results
		$query = $this->DB->prepare($query);
		$query->execute();
		return $query->fetchAll(PDO::FETCH_ASSOC);
	}
	
	public function getItem($id){
		$query = 'Select * from item where id = :id';
		$query = $this->DB->prepare($query);
		$query->bindParam(':id', $id);
		$query->execute();
		return $query->fetchAll(PDO::FETCH_ASSOC);
	}
	// Get a user's purchases with the query:
	// 	select purchase.itemId, purchase.status, purchase.purchaseDate, item.productName, item.cost
	//	from purchase, item 
	//	where userId = :id and purchase.itemId = item.id;
	public function getUserPurchases($id){
		// Build the query
		$query = 'select purchase.itemId, purchase.status, purchase.purchaseDate, item.productName, item.cost ';
		$query .= 'from purchase, item ';
		$query .= 'where userId = :id and purchase.itemId = item.id ';

		// Execute teh query with a bound parameter
		$query = $this->DB->prepare($query);
		$query->bindParam(':id', $id);
		$query->execute();
		return $query->fetchAll(PDO::FETCH_ASSOC);	
	}

	// Get a user's shoppin cart with this query:
	// 	select item.id, item.productName, item.cost 
	//	from cart, user, item
	//	where user.id = :id and cart.userId = user.id and item.id = cart.itemId;
	public function getUserCart($id){
		// Build the query
		$query = 'select item.id, item.productName, item.cost, cart.quantity, item.imageLink ';
		$query .= 'from cart, user, item ';
		$query .= 'where user.id = :id and cart.userId = user.id and item.id = cart.itemId ';
	
		// Execute the query with a bound parameter
		$query = $this->DB->prepare($query);
		$query->bindParam(':id', $id);
		$query->execute();
		return $query->fetchAll(PDO::FETCH_ASSOC);	
	}

	// Check to see if a user with a given email exists with the folowing query:
	//	select count(*) from user where email = :email
	// True is returned if there is a user with the given email; negative is returned
	// otherwise
	private function emailExists($email){
		// Build the query
		$query = 'select count(*) from user where email = :email';
		
		// Execute the query with a bound parameter
		$query = $this->DB->prepare($query);
		$query->bindParam(':email', $email);
		$query->execute();
		$query = $query->fetchAll(PDO::FETCH_ASSOC);
		return $query[0]["count(*)"] >= 1;
	}

	// Register a user with a given email, zipcode, and password with this query:
	//	insert into user(email, hash, zipcode) values(:email, :password , :passcode)
	// True is returned if the registration was sucessful; false is returned if the given email
	// is already in use
	public function register($email, $password, $zipcode){
		// Build the same query
		$query = 'insert into user(email, hash, zipcode) values(:email, :password, :zipcode)';

		// Hash the password
		$password = password_hash($password, PASSWORD_DEFAULT);

		if($this->emailExists($email)){
			return false;
		}

		// Execute the query with bound parameters
		$query = $this->DB->prepare($query);
		$query->bindParam(':email', $email);
		$query->bindParam(':password', $password);
		$query->bindParam(':zipcode', $zipcode);
		$query->execute();

		return true;
	}
	
	// Check to see if the email-password pair is valid
	// THe id of the user is returned if the login is valid
	// -1 is returned if the email doesn't exist
	// -2 is returned if the email exists but the password is incorrect
	public function validate($email, $password){
		// Check if the email exists
		if(!$this->emailExists($email)){
			return -1;
		}

		// Retrieve the password corresponding to the email
		$hashed = 'select * from user where email = :email';
		$hashed = $this->DB->prepare($hashed);
		$hashed->bindParam(':email', $email);
		$hashed->execute();

		// Get information about the user
		$tuple = $hashed->fetchAll(PDO::FETCH_ASSOC)[0];
		$id = $tuple["id"];
		$hashed = $tuple["hash"];

		// Check to see if the passwords match
		if(password_verify($password, $hashed)){
			$_SESSION["user"] = $email;
			$_SESSION["id"] = $id;
			return true;
		} else {
			return -2;
		}
	}
	
	// Get all of the reviews and their authors for a given item
	// 	select user.email, review.blurb from review, user where user.id = review.userId and itemId = :itemId
	public function getReviews($itemId){
		// Build the query
		$query = "select review.reviewId, user.email, review.blurb from review, user where user.id = review.userId and itemId = :itemId";
		
		// Execute the query with a bound parameter
		$query = $this->DB->prepare($query);
		$query->bindParam(':itemId', $itemId);
		$query->execute();
		return $query->fetchAll(PDO::FETCH_ASSOC);	
	}
	
	// Move the items in a user's shopping cart to their purchases
	public function checkout($userId){
		// Fetch what's in the cart
		$query = "insert into purchase(userId, purchaseDate) values(:userId,current_timestamp)";
		$query = $this->DB->prepare($query);
		$query->bindParam(':userId', $userId);
		$query->execute();

		$query = "select MAX(purchaseId) from purchase where userId = :userId";
		$query = $this->DB->prepare($query);
		$query->bindParam(':userId', $userId);
		$query->execute();
		$results = $query->fetchAll(PDO::FETCH_ASSOC);
		$purchaseID = $results[0]["MAX(purchaseId)"];
		$cart = $this->getUserCart($userId);
		
		// Add each cart item as a purchased item
		foreach($cart as $item){
			// Build the query and bind parameters from the cart table
			$query = "insert into purchasedItem(purchID, itemId, cost, quantity) values(:purchID, :itemID, :cost, :quantity)";
			$query = $this->DB->prepare($query);
			$query->bindParam(':purchID', $purchaseID);
			$query->bindParam(':itemID', $item["id"]);
			$query->bindParam(':cost', $item["cost"]);
			$query->bindParam(':quantity', $item["quantity"]);
			$query->execute();
		}

		// Clear the cart
		$query = "delete from cart where userId = :userId";
		$query = $this->DB->prepare($query);
		$query->bindParam(':userId', $userId);
		$query->execute();

		return $purchaseID;
	}
	public function getPurchase($purchaseID){
		$query = "select * from purchase,purchasedItem,item where purchase.purchaseId = :id and purchasedItem.purchId = purchase.purchaseId and purchasedItem.itemId = item.id";
		$query = $this->DB->prepare($query);
		$query->bindParam(':id', $purchaseID);
		$query->execute();
		$results = $query->fetchAll(PDO::FETCH_ASSOC);
		return $results;


	}
	
	// Add a user's review to the database using the following query
	//		insert into review(userId, itemId, blurb) values (:userId, :itemId, :review)
	public function addReview($itemId, $review){
		// Build the query
		$query = 'insert into review(userId, itemId, blurb) values (:userId, :itemId, :review)';

		// Execute the query with count parameters
		$query = $this->DB->prepare($query);
		$query->bindParam(':userId', $_SESSION["id"]);
		$query->bindParam(':itemId', $itemId);
		$query->bindParam(':review', $review);
		$query->execute();
	}

	// Vote for a dog with the following query
	//		update dog set votes = votes + 1 where dogId = :dogId
	public function vote($dogId){
		// Build the query
		$query = 'update dog set votes = votes + 1 where dogId = :dogId';

		// Execute the query with bound parameters
		$query = $this->DB->prepare($query);
		$query->bindParam(':dogId', $dogId);
		$query->execute();
	}

	// Add an item to a shopping cart with the following query
	//		insert into cart(userId, itemId) values(:userId, :itemId)
	public function addToCart($userId, $itemId, $quantity){
		// Build the query
		$query = 'insert into cart(userId, itemId, quantity) values(:userId, :itemId, :quantity)';

		// Execute the query with bound parameters
		$query = $this->DB->prepare($query);
		$query->bindParam(':userId', $userId);
		$query->bindParam(':itemId', $itemId);
		$query->bindParam(':quantity', $quantity);
		$query->execute();
	}
	public function deleteReview($reviewID){

		// Clear the review
		$query = "delete from review where reviewId = :reviewID";
		$query = $this->DB->prepare($query);
		$query->bindParam(':reviewID', $reviewID);
		$query->execute();
	}

	// Filter items by their kind with the following query
	//		select * from item where kind = :kind
	public function getItemByKind($kind){
		// Build the query
		$query = 'select * from item where kind = :kind';
		
		// Execute and return the results
		$query = $this->DB->prepare($query);
		$query->bindParam(':kind', $kind);
		$query->execute();
		return $query->fetchAll(PDO::FETCH_ASSOC);
	}

	/*-----------------------------ANYTHING BELOW THIS IS UNTESTED-----------------------------*/

} // DatabaseAdapter

// Create an instance of the adapter
$dba = new DatabaseAdapter();

/*
// Get each type of item
print_r($dba->getItemByKind(0));
print_r($dba->getItemByKind(1));
print_r($dba->getItemByKind(2));
*/

/*
// Add an item to a cart
$dba->addToCart(2, 1);
*/

/*
// Vote for Rufus
$dba->vote(3);
*/

/*
// Checkout Emanuel
$dba->checkout(1);
*/

/*
// Get the reviews for the dog collar
print_r($dba->getReviews(3));
// Get the reviews for the squeaky fox
print_r($dba->getReviews(5));
// Get a review for something that doesn't have reviews yet
print_r($dba->getReviews(2));
*/

/*
// Register us
if(!$dba->register("Emanuel@gmail.com", "doggo", 85037)){
	echo "Emanuel not registered";
}
if(!$dba->register("Nicole@gmail.com", "doggo", 85719)){
	echo "Nicole not registered";
}
*/

/*
// Validate a valid login
echo $dba->validate("Nicole@gmail.com", "doggo");
// Bad email
echo $dba->validate("Emanasdfuel@gmail.com", "doggo");
// Bad password
echo $dba->validate("Emanuel@gmail.com", "doggsdfnjko");
*/

/* 
// Print each item
$items = $dba->getItems();
foreach($items as $item){
	print_r($item);
}
unset($item);
*/

/*
// Get a user's purchases
print_r($dba->getUserPurchases(1));
print_r($dba->getUserPurchases(2));
*/

/*
// Get user's shopping cart
print_r($dba->getUserCart(1));
print_r($dba->getUserCart(2));
*/

/*
// Check to see if an email exists
if($dba->emailExists("nope@gmail.com")){
	echo "Exists";
} else {
	echo "Doesn't exist";
}
*/

/*
// Try to register a new user
if($dba->register("test@gmail.com", "test", 12345)){
	echo "Registration successful";
} else {
	echo "Registration unsuccessful";
}

// Try resuse the same email from above
if($dba->register("test@gmail.com", "test", 12345)){
	echo "Registration successful";
} else {
	echo "Registration unsuccessful";
}
*/
?>