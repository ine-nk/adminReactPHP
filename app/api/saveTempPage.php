<?php
// декодируем json формат пришедший из инпут ( строки ввода):


$_POST = json_decode(  file_get_contents('php://input'), true );
$newFile = "../../temp.html";

if($_POST['html']) {  //? проверяем массив POST и если в нем  пришел html  - то значит пришла DOM структура 
  file_put_contents($newFile, $_POST['html']);
} else {
  // fopen($newFile, "w");
  // поместим пришедшийй  html  в файл через команду php file_put_contens(имя_файла_куда_поместить , что_хотим_поместить)
  header("HTTP/1.0 400 Bad Request");
};


