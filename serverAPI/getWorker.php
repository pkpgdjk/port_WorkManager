<?php 
include 'config.php';

	header('Content-type: application/json');
	header('Access-Control-Allow-Origin: *');

$reception = $_GET['reception'];

$sql = "SELECT username FROM `account` WHERE `manager` = :reception";
	$dbh = $conn->prepare($sql);
	$dbh->execute(array(':reception' => $reception));
	$data = $dbh->fetchAll(PDO::FETCH_ASSOC);

	echo json_encode(array(
		"status"=>200,
		"data"=>$data));

 ?>