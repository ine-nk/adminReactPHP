<?php
$htmlfiles = glob("../../*.html");
// echo var_dump($htmlfiles);

$responce = [];
foreach ($htmlfiles  as $file ) {
  
  array_push($responce, basename($file)); // запись в массив - (название массива, что пушим)
};

echo json_encode($responce); // возвращаем данные в формате json


?>

