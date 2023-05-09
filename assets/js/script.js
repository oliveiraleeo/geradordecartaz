/* ----- Dropdowns script ---- */

screenButton = document.querySelector('#botao-imprimir')

screenButton.addEventListener('click', () => {
  // Exibe o elemento com a animação de carregamento
  const loadingOverlay = document.querySelector('.loading-overlay')

  loadingOverlay.style.display = 'flex'

  $('.imprimirC').printThis({
    debug: false,
    importCSS: true,
    importStyle: true,
    printContainer: true,
    loadCSS: '',
    pageTitle: false,
    removeInline: false,
    removeInlineSelector: '*',
    printDelay: 2000,
    header: null,
    footer: null,
    base: false,
    formValues: true,
    canvas: false,
    doctypeString: '',
    removeScripts: false,
    copyTagClasses: true,
    copyTagStyles: true,
    beforePrintEvent: null,
    beforePrint: null,
    afterPrint: () => {
      // Esconde o elemento com a animação de carregamento
      loadingOverlay.style.display = 'none'
    }
  })

  pegarValor()
})

function showUnit() {
  let unitEl = document.querySelector('.input-select.burden')
  let unitValue = document.querySelector(
    'div[data-array-name="unidades"].dropdown'
  ).innerText

  if (unitValue === 'Fardo') {
    unitEl.style.display = 'block'
  } else {
    unitEl.style.display = 'none'
  }
}

// Copia de arrays
const arrays = {
  folhas: [...folhas],
  selos: [...selos],
  unidades: [...unidades]
}

// Variaveis para Impressão

function pegarValor() {
  // pega o selo para impressao

  let sizeFolha = document.querySelector(
    'div[data-array-name="folhas"].dropdown'
  ).innerText

  let Inputselo = document
    .querySelector('div[data-array-name="selos"].dropdown')
    .innerText.toLowerCase()

  let selo = arrays.selos.filter(item => {
    return item.name.toLowerCase() === Inputselo
  })

  if (selo.length > 0) {
    document.querySelector(
      '.folha-01 .f-selo img'
    ).src = `assets/images/${selo[0].img}`
  }

  //Pega o titulo do produto

  let textInput = document.querySelector('.textInput.name').value
  let containerTitle = document.querySelector('.folha-01 .f-title-product')
  containerTitle.innerText = textInput

  // Pega o preço do produto
  let priceValue = document.querySelector('.textInput.input-price').value
  let priceArray = priceValue.split(',')
  let priceBeforeComma = priceArray[0].split(' ')[1]
  let priceAfterComma = priceArray[1]
  let priceUnited = `${priceBeforeComma}.${priceAfterComma}`

  document.querySelector('.f-title--before-comma').innerText = priceBeforeComma
  document.querySelector(
    '.f-title--after-comma span'
  ).innerText = `,${priceAfterComma}`

  // Pega o codigo do produto

  let codProd = document.querySelector('.textInput.cod-input').value
  let codEl = document.querySelector('.folha-01 .cod')
  codEl.innerText = codProd

  // pega data validade

  let dateValidate = document.querySelector('.textInput.validate').value
  let elValidate = document.querySelector('.folha-01 .validity')

  let dateObj = new Date(dateValidate)
  let day = dateObj.getDate() + 1
  let month = dateObj.getMonth() + 1 // adicionar 1 porque os meses são indexados em zero
  let year = dateObj.getFullYear()

  let formattedDate = `${day.toString().padStart(2, '0')}/${month
    .toString()
    .padStart(2, '0')}/${year.toString()}`

  if (dateValidate) {
    elValidate.innerText = `Valido até dia ${formattedDate}`
  } else {
    elValidate.innerText = ''
  }

  // pega valor unidade

  let unitValue = document.querySelector('.input-select.burden input').value
  let unitEl = document.querySelector('.burden-price span')
  let unitElPrice = document.querySelector('.burden-price .priceBurden ')

  totalUnit = priceUnited * unitValue

  if (totalUnit) {
    document.querySelector('.burden-price').style.display = 'flex'
    unitEl.innerText = `fardo c/ ${unitValue}`
    unitElPrice.innerText = `R$ ${totalUnit}`
  } else {
    document.querySelector('.burden-price').style.display = 'none'
  }
}

// Inicio Select personalizado  ---------------

const dropdowns = document.querySelectorAll('.dropdown')

const addCountry = (arr, el, inner) => {
  const select = inner

  el.innerHTML = ''
  const options = arr.map(item => `<li>${item.name}</li>`).join('')
  el.insertAdjacentHTML('beforeend', options)
  el.querySelectorAll('li').forEach(option => {
    if (option.innerText === select) {
      option.classList.add('active')
    }
    option.addEventListener('click', () => clickOn(option))
  })
}

const clickOn = option => {
  const dropdown = option.closest('.dropdown')
  const selectBtn = dropdown.querySelector('.select')
  const content = dropdown.querySelector('.content')
  const arrow = dropdown.querySelector('.arrow')
  const searchInput = dropdown.querySelector('input')

  selectBtn.querySelector('span').innerText = option.innerText
  content.classList.toggle('menu-open')
  arrow.classList.toggle('arrow-rotate')
  selectBtn.classList.toggle('select-clicked')
  searchInput.value = ''

  showUnit()
}

dropdowns.forEach(dropdown => {
  const selectBtn = dropdown.querySelector('.select')
  const searchInput = dropdown.querySelector('input')
  const menu = dropdown.querySelector('.menu')
  const content = dropdown.querySelector('.content')
  const arrow = dropdown.querySelector('.arrow')
  let countrys = []

  if (dropdown.dataset.arrayName && arrays[dropdown.dataset.arrayName]) {
    countrys = arrays[dropdown.dataset.arrayName]
  }

  selectBtn.addEventListener('click', () => {
    content.classList.toggle('menu-open')
    arrow.classList.toggle('arrow-rotate')
    selectBtn.classList.toggle('select-clicked')
    addCountry(countrys, menu, selectBtn.innerText)
  })

  searchInput.addEventListener('keyup', () => {
    const searchedVal = searchInput.value.toLowerCase()
    const filteredCountries = countrys.filter(country => {
      return country.name.toLowerCase().includes(searchedVal)
    })
    addCountry(filteredCountries.length ? filteredCountries : countrys, menu)
  })
})

// Fim  Select personalizado  ---------------

const precoInput = document.querySelector('.input-price')

precoInput.addEventListener('input', event => {
  const preco = event.target.value.replace(/\D/g, '') // remove tudo que não é número
  const precoFormatado = formatarPreco(preco) // formata o preço
  event.target.value = `R$ ${precoFormatado}` // atualiza o valor do campo de entrada
})

function formatarPreco(preco) {
  let precoFormatado = preco
  // insere a vírgula separando os centavos
  precoFormatado = `${precoFormatado.substr(
    0,
    precoFormatado.length - 2
  )},${precoFormatado.substr(precoFormatado.length - 2)}`

  return precoFormatado
}

const codigoInput = document.querySelector('.cod-input')

codigoInput.addEventListener('input', event => {
  const preco = event.target.value.replace(/[^0-9/]/g, '') // remove tudo que não é número
  event.target.value = `Cód:. ${preco}` // atualiza o valor do campo de entrada
})
