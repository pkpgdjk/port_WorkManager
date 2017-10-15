<?php 
include 'config.php';


	header('Content-type: application/json');
	header('Access-Control-Allow-Origin: *');

// reception get they work
	if ($_GET['reception'] !='admin' && !isset($_GET['filterType']) or $_GET['filterType'] == "filterAll"  ) {
		$sql = "SELECT * FROM `work` WHERE manager=:reception and hide <> 1 ";
		$sqlGroup = "SELECT DISTINCT id,Title FROM `work` WHERE manager=:reception and hide <> 1 ORDER BY id";
		$reception = $_GET['reception'];

		$dbh = $conn->prepare($sql);
		$dbh->execute(array("reception" =>$reception));
		$item = $dbh->fetchAll(PDO::FETCH_ASSOC);


		$dbh = $conn->prepare($sqlGroup);
		$dbh->execute(array("reception" =>$reception));
		$group = $dbh->fetchAll(PDO::FETCH_ASSOC);
		
		exit(json_encode(array(
		"status"=>200,
		"item"=>$item,
		"group"=>$group)));

// filter Worker
	}else if (isset($_GET['filterType']) && $_GET['filterType'] =='filterWorker') {
		$sql = "SELECT * FROM `work` WHERE owner=:owner and hide <> 1 ";
		$sqlGroup = "SELECT id,Title FROM `work` WHERE owner=:owner and hide <> 1 ORDER BY id";
		$owner = $_GET['filterTxt'];

		$dbh = $conn->prepare($sql);
		$dbh->execute(array("owner" =>$owner));
		$item = $dbh->fetchAll(PDO::FETCH_ASSOC);


		$dbh = $conn->prepare($sqlGroup);
		$dbh->execute(array("owner" =>$owner));
		$group = $dbh->fetchAll(PDO::FETCH_ASSOC);
		
		exit(json_encode(array(
		"status"=>200,
		"item"=>$item,
		"group"=>$group)));

	}else if (isset($_GET['filterType']) && $_GET['filterType'] =='filterReception') {
		$sql = "SELECT * FROM `work` WHERE manager=:reception and hide <> 1 ";
		$sqlGroup = "SELECT DISTINCT id,Title FROM `work` WHERE manager=:reception and hide <> 1 ORDER BY id";
		$reception = $_GET['filterTxt'];

		$dbh = $conn->prepare($sql);
		$dbh->execute(array("reception" =>$reception));
		$item = $dbh->fetchAll(PDO::FETCH_ASSOC);


		$dbh = $conn->prepare($sqlGroup);
		$dbh->execute(array("reception" =>$reception));
		$group = $dbh->fetchAll(PDO::FETCH_ASSOC);
		
		exit(json_encode(array(
		"status"=>200,
		"item"=>$item,
		"group"=>$group)));
	}

	$sql = "SELECT * FROM `work` and hide <> 1 ";
	$sqlGroup = "SELECT DISTINCT id,Title FROM `work` and hide <> 1 ORDER BY id";

	$dbh = $conn->prepare($sql);
	$dbh->execute();
	$item = $dbh->fetchAll(PDO::FETCH_ASSOC);


	$dbh = $conn->prepare($sqlGroup);
	$dbh->execute();
	$group = $dbh->fetchAll(PDO::FETCH_ASSOC);


	echo json_encode(array(
		"status"=>200,
		"item"=>$item,
		"group"=>$group));


 ?>
