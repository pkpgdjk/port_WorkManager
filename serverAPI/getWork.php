<?php 
include 'config.php';

$username = $_GET['username'];
$password = $_GET['password'];


$sql = "SELECT username,type FROM account where username = :username and password = :password ";
$dbh = $conn->prepare($sql);
$dbh->execute(array(':username' => $username, ':password' => $password ));
$login = $dbh->fetch(PDO::FETCH_ASSOC);

	header('Content-type: application/json');
	header('Access-Control-Allow-Origin: *');



if ($dbh->rowCount() > 0) {
	$sql = "SELECT * FROM `work` WHERE `owner` = :username and hide <> 1";
	$dbh = $conn->prepare($sql);
	$dbh->execute(array(':username' => $username));
	$item = $dbh->fetchAll(PDO::FETCH_ASSOC);

	$sql = "SELECT DISTINCT id,Title FROM `work` WHERE `owner` = :username and hide <> 1 ORDER BY id";
	$dbh = $conn->prepare($sql);
	$dbh->execute(array(':username' => $username));
	$group = $dbh->fetchAll(PDO::FETCH_ASSOC);


	echo json_encode(array(
		"status"=>200,
		"item"=>$item,
		"group"=>$group,
		"user"=>$login));
}else{
	echo json_encode(array("status"=>"error","error"=>"Login failed"));
	
}

 ?>
