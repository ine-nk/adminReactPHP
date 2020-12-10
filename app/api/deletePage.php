<?php
// декодируем json формат пришедший из инпут ( строки ввода):


$_POST = json_decode(  file_get_contents('php://input'), true );
$file = "../../" .  $_POST["name"] ;

if(file_exists($file)) {
  unlink($file) ;                       //! команда удаления файла через PHP
} else {
  header("HTTP/1.0 400 Bad Request");
};
