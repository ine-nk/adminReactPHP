// для  работы с сервером импорт бибилиотеки axios
import '../../helpers/iframeLoader.js'
import axios from 'axios'
import React, { Component } from 'react'

export default class Editor extends Component {
  constructor() {
    super()
    //? задание текущей страници - изначально index.html ( потом может поменяться)
    this.currentPage = 'index.html'
    this.state = {
      pageList: [],
      newPageName: ''
    }
    this.createNewPage = this.createNewPage.bind(this)
  }

  //! хук который отслеживает рендеринг на странице - если она отрендерилась -то можно отправлять запрос к серверу
  componentDidMount() {
    this.init(this.currentPage)
  }

  //? инициализация страницы  принимает page которую надо загрузить в iframe
  init(page) {
    //? 1- записываем в переменную iframe  найденное положение  тэга iframe
    this.iframe = document.querySelector('iframe')
    //? 2- с помощью метода open - открываем нужную страницу page
    this.open(page)
    //? 3- загружаем список созданых страниц
    this.loadPageList()

  }

  open(page) {
    //? перезаписываем переменнюу carrentPage нужной страницей
    // ? для того чтобы при обращении к странице всегда загружалась новая ( не из кэша) добавим  ?rnd=${Math.random() -случайное число которое всегда будет новое при обращении

    this.currentPage = `../${page}?rnd=${Math.random()}`

    // ? хотим получить исходный код страницы при помощи " axios " просто послав GET запрос к определенной странице

    axios
      .get(`../${page}`)
      .then(res => this.parseStrToDOM(res.data))
      .then(this.wrapTextNodes) //* wrapTextNodes записываем без ()  - так как 
      //*он находится в .then и будет вызван с полученными данными из предыдущего //* .then
      //* сохраним чистую копию в virtualDom ( переменная )
      .then(dom => {
        this.virtualDom = dom
        return dom   //* после записи в virtualDOM взвращаем dom - пробросили для другого then
      })
      .then(this.serializeDOMToString)
      .then(html => axios.post('./api/saveTempPage.php', { html }))
      //* полученный после пробразования DOM-дерева в строчный формат объекта html отправляем через axios методом post во временный файл по адресу  ./api/saveTempPage.php
      //* теперь можно временную страницу загруть в iframe
      .then(() => this.iframe.load('../temp.html'))
      .then(() => this.enableEditing())





    //* напрямую полученый HTML код загрузить в iframe  не получится - для этого надо сначала загрузить его в html файл на сервере а потом передвать его в iframe ( какую-то информацию надо передать в  src ....  а в него можно передать только адрес страницы)

    //? когда iframe полностью загрузился ( выполнился метод load для  currentPage) выполняем стрелочную функцию по выводу имени странцицы в консоль
    // this.iframe.load(this.currentPage, () => {
    //   // console.log(this.currentPage);
    // })
  }


  enableEditing() {
    this.iframe.contentDocument.body.querySelectorAll('text-editor').forEach(element => {
      element.contentEditable = "true"
    })
  }

  parseStrToDOM(str) {
    const parser = new DOMParser(); //* создаем parser через конструктор new DOMParser() и этот метод будет принимать в себя строку которую получает от сервера

    return parser.parseFromString(str, "text/html"); //* возвращаем результат работы парсера из поступившего строкового документа str в формат text/html
  }
  //* после работы парсера возвращается чистая копия DOM дерева  -  в ней надо найти только изменяемые текстовые узлы

  wrapTextNodes(dom) {
    // const body = this.iframe.contentDocument.body;
    const body = dom.body;
    //? делаем пустой массив для текстовых узлов
    let textNodes = []

    //? создаем функцию которая рекурсивно будет перебирать элементы пока не дойдет до самой последленей в тэге
    function recursy(element) {

      element.childNodes.forEach(node => {
        //*  console.log(node);  будем уточнаять условие показа элементов
        //? если в node имеются еще nodes то запускаем внутри рекурсию еще раз
        //*  if(node.childNodes.length>1){
        //? если nodeName  есть #text  и значение где все пробелы убраны ( замененны через регулярное выражение) и длина с заменами больше нуля тогда выводим в консоль

        if (node.nodeName === "#text" && node.nodeValue.replace(/\s+/g, "").length > 0) {
          // console.log(node);
          textNodes.push(node)
        } else {
          recursy(node)
        }
      })
    }
    // body.childNodes.forEach(node => {
    //   console.log(node);
    // })
    //? вызываем рекурсивную функцию  по созданной переменной body
    recursy(body)
    //? и в консоли получаем список всех нод включая пустые текстовые

    textNodes.forEach((node, i) => {
      //* нам надо присвоит атрибут contenteditable найденым нодам но атрибут для редактикрования присваивается только ТЭГАМ!!! 
      // ?  для  этого создадим наш личный тэг который никак не будет влиять на расположение на странице внутри this.iframe.contentDocument через createElement собственный элемент text-editor. Этот тэг будет использоваться внутри админки и как только страница будет выгружаться на сервер - то этого элемента там уже не будет

      //! const wrapper = this.iframe.contentDocument.createElement('text-editor')
      //* теперь мы обращаемся просто к dom \/
      const wrapper = dom.createElement('text-editor')
      // ? внутрь wrapper надо поместить нашу node через обращение к родителю нашей текстовой node
      node.parentNode.replaceChild(wrapper, node)   //? у родителя ноду удалили
      wrapper.appendChild(node)   //? и в обертку снова добавляем ноду 
      // wrapper.contentEditable = "true"   
      //? потом переместиться в другое место 
      wrapper.setAttribute('nodeid', i)


      //? для обертки включем атрибут редактирования ноды
    })
    return dom //* из метода возвращаем dom структуру
  }

  //* для сохранения DOM-стурктуры в файл её необходимо сконвертироват в строку - для этого делаем serialzeDOMToString  с использованием XMLSerializer


  serializeDOMToString(dom) {
    const serializer = new XMLSerializer();
    return serializer.serializeToString(dom);
  }

  loadPageList() {
    axios
      .get('./api')
      .then(res => this.setState({ pageList: res.data }))
  }


  createNewPage() {
    axios
      .post('./api/createNewPage.php', { 'name': this.state.newPageName })
      .then(this.loadPageList())
      .catch(() => alert("Страница уже существует!"))
  }

  deletePage(page) {
    // console.log(page);
    axios
      .post('./api/deletePage.php', { "name": page })
      .then(this.loadPageList())
      .catch(() => alert("Страницы не существует!"))
  }


  render() {
    // const { pageList } = this.state
    // const pages = pageList.map((page, i) => {
    //   return (
    //     <h1 key={i}>{page}
    //       <a href="#"
    //         // onClick={() => console.log(page)}
    //         onClick={() => this.deletePage(page)}
    //       >(x)</a>
    //     </h1>
    //   )
    // })

    return (
      //? не открываем какую-то конкретную страницу - а ту которая передана через currentPage
      <iframe src={this.currentPage} frameBorder="0" ></iframe>
      // <iframe>
      //   <input
      //     onChange={(e) => { this.setState({ newPageName: e.target.value }) }}
      //     type="text" />
      //   <button onClick={this.createNewPage} >Создать страницу</button>
      //   {pages}
      // </iframe>
    )

  }
}