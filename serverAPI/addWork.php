<?php 
	header('Content-type: application/json');
	header('Access-Control-Allow-Origin: *');
include 'config.php';


	try {

		if ($_GET['modalState'] == 'add') {
			$sql = "INSERT INTO work(id,Title,StartDate,EndDate,gName,templateId,state,manager,googleLink,comment,total,owner,booking) VALUES (null,:Title,:StartDate,:EndDate,:gName,:templateId,:state,:manager,:googleLink,:comment,:total,:owner,:booking)";
			$dbh = $conn->prepare($sql);
			$dbh->execute(array(
				":Title"=> $_GET['wTitle'],
				":StartDate"=>$_GET['wStartDate'],
				":EndDate"=>$_GET['wEndDate'],
				":gName"=>$_GET['wTitle'],
				":templateId"=>$_GET['wTemplateId'],
				":state"=>$_GET['wState'],
				":manager"=>$_GET['wManager'],
				":googleLink"=>$_GET['wGgLink'],
				":comment"=>$_GET['wComment'],
				":total"=>$_GET['wPaid'],
				":owner"=>$_GET['wWorker'],
				":booking"=>$_GET['wBooking']
				));
		}else if($_GET['modalState'] == 'edit'){

			$sql = "UPDATE work set 
			Title=:Title,
			StartDate=:StartDate,
			EndDate=:EndDate,
			gName=:gName,
			templateId=:templateId,
			state=:state,
			manager=:manager,
			googleLink=:googleLink,
			comment=:comment,
			total=:total,
			owner=:owner,
			booking=:booking
			 WHERE id =:id ";
			$dbh = $conn->prepare($sql);
			$dbh->execute(array(
				":Title"=> $_GET['wTitle'],
				":StartDate"=>$_GET['wStartDate'],
				":EndDate"=>$_GET['wEndDate'],
				":gName"=>$_GET['wTitle'],
				":templateId"=>$_GET['wTemplateId'],
				":state"=>$_GET['wState'],
				":manager"=>$_GET['wManager'],
				":googleLink"=>$_GET['wGgLink'],
				":comment"=>$_GET['wComment'],
				":total"=>$_GET['wPaid'],
				":id"=>$_GET['wId'],
				":owner"=>$_GET['wWorker'],
				":booking"=>$_GET['wBooking']
				));
		}

		echo json_encode(array("status"=>"success"));
	} catch (PDOException $e) {
	
		json_encode(array("status"=>"error","msg"=>"Database Error : ".$e->getMessage()));	
	}


 ?>