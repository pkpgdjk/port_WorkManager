<?php 
include 'config.php';

	header('Content-type: application/json');
	header('Access-Control-Allow-Origin: *');

$id = $_GET['id'];

$sql = "SELECT * FROM `work` WHERE `id` = :id  limit 1";
	$dbh = $conn->prepare($sql);
	$dbh->execute(array(':id' => $id));
	$data = $dbh->fetchAll(PDO::FETCH_ASSOC);

	echo json_encode(array(
		"status"=>200,
		"data"=>$data));

 ?>