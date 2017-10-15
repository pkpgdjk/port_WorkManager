<?php 

$server = 'localhost';
$dbname = 'epiz_20614401_manager';
$user = 'root';
$pass = '';

try{
    $conn = new PDO("mysql:host=$server;dbname=$dbname", $user, $pass);
}catch(PDOException $e){
    echo ($e->getMessage());
}
 ?>