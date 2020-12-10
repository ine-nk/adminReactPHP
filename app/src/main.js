// import $ from 'jquery'

import  React from 'react'
import ReactDOM from 'react-dom'
import Editor from './components/editor'



//* рендеринг на страницу нашего редактора
ReactDOM.render(<Editor/> , document.getElementById('root'))

/*

function getPageList() {
  $("h1").remove() // удаляем все заголовки h1 на странице
  $.get('./api', data => {
    console.log(data);
    console.log(data[0])
    data.forEach(file => {
      $("body").append(`<h1>${file}</h1>`)
    });
  }, "JSON");

}
// эта функция должна вызываться когда страница загружается

getPageList()


// назаначаем обработчик события нажатия на кнопку - которую мы создали
$("button").click(() => {
  console.log('pingo!!!!!!!!!!');
  // console.log($("input").val());
  $.post("./api/createNewPage.php", {
    "name": $("input").val()
  }, () => { getPageList() }) //  получаем список страниц
    .fail(() => {
      alert("Страница уже существует!")
    })
})

*/


// * получение  данных от php  файла  и распарсть формат json



