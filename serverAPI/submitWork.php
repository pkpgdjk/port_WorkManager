<?php 
include 'config.php';

	header('Content-type: application/json');
	header('Access-Control-Allow-Origin: *');



if (!isset($_GET['id']) || !isset($_GET['link'])) {
	exit(json_encode(array(
		"status"=>'error'
		)));
}

$id = $_GET['id'];
$link = $_GET['link'];

$sql = "UPDATE work set workerSubmit=1,workerLink=:link WHERE `id` = :id";
	$dbh = $conn->prepare($sql);
	$dbh->execute(array(
		':id' => $id,
		':link' =>$link

		));
	$data = $dbh->fetchAll(PDO::FETCH_ASSOC);

	echo json_encode(array(
		"status"=>200));

 ?>