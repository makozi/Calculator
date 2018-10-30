// const inputField= document.querySelector('.input-field')
// const numField= document.querySelector('.num-field')
// const contentOutputs= document.querySelectorAll('.content-ouput')
// const outputPrimary= document.querySelector('.input')
// const outputSecondary= document.querySelector('.output-secondary input')
// const equallyButton= document.querySelector('#equally')
// const deleteButton= document.querySelector('#delete')

// const operandsRegExp= /[\d\.]/
// const operatorRegExp= /[\+\*\/]/
// const generalRegExp= /[\+\-\*\/\d\.]/

// let exp = ""
// let operationIndex=0
// let operands= ['']
// let operators= []

// let holdTimer

// //event listener
// contentOutputs.forEach(function(contentOutput){
//     contentOutput.addEventListener('mousedown', inputFromScreen)
// })
// equallyButton.addEventListener('mousedown', answerToOutputPrimary)




// d




const inputField = document.querySelector('.input-field')
const numField = document.querySelector('.num-field')
const contentOutputs = document.querySelectorAll('.content-output')
const outputPrimary = document.querySelector('input')
const outputSecondary = document.querySelector('.output-secondary input')
const equallyButton = document.querySelector('#equally')
const deleteButton = document.querySelector('#delete')

const operandsRegExp = /[\d\.]/
const operatorsRegExp = /[\+\*\/]/
const generalRegExp = /[\+\-\*\/\d\.]/

let exp = ""
let operationIndex = 0
let operands = ['']
let operators = []

let holdTimer

// Event listeners
contentOutputs.forEach(function(contentOutput) {
    contentOutput.addEventListener('mousedown', inputFromScreen)
})
equallyButton.addEventListener('mousedown', answerToOutputPrimary)
deleteButton.addEventListener('mousedown', onDeleteDown)
deleteButton.addEventListener('mouseup', onDeleteUp)
document.addEventListener('keydown', inputFromKeyboard)

// Handling holds and clicks
function onDeleteDown() {
    holdTimer = window.setTimeout(onDeleteHold, 1000)
}

function onDeleteUp() {
    if (holdTimer) window.clearTimeout(holdTimer) // if clicking 'DEL' button, then clear last character
    lastClear()
}

function onDeleteHold() {
    allClear() // if holding 'DEL' - clear all
}

// Main functions
function inputFromKeyboard(event) {
    let eventKey = event.key
    if (generalRegExp.test(event.key) && !(/[f]/i.test(event.key)) && inputIsValid(eventKey)) { // second test() is need to prevent F1-F12 keys input
        outputPrimary.value += eventKey
        inputProcessing()
    }

    switch(eventKey) {
        case 'Enter': 
            answerToOutputPrimary()
            break
        case 'Backspace':
            lastClear()
            break
    }
}

function inputFromScreen(event) {
    let eventTextContent = event.target.textContent
    if (inputIsValid(eventTextContent)) {
        outputPrimary.value += eventTextContent
        inputProcessing()
    }
}

function inputIsValid(eventContent) {
    let opVal = outputPrimary.value
    let opValLastIndex = opVal.length - 1
    let opValLast = outputPrimary.value[opValLastIndex]
    if (((opVal === "" || /[\+\*\/\.]/.test(opValLast)) && /[\+\*\/\.]/.test(eventContent)) || ((/[\-]/.test(opValLast)) && (/[\-\+\*\/]/.test(eventContent)))) {
        return false
    } else {
        return true
    }
}

function inputProcessing() {
    updateExp() 
    parsingExp()
    if (outputPrimary.value === '-') {return}
    outputAnswer(calculateAnswer())
}

function updateExp() {
    exp = outputPrimary.value
}

function parsingExp() {
    let expLast = exp[exp.length - 1]  
    if (operands[operationIndex] === undefined) {operands[operationIndex] = ''}
    if ((expLast === '-')) {
        operators[operationIndex] = '+'
        if (operands[operationIndex] !== '') {operationIndex++} // if condition is need for such cases: x*-y, x/-y to prevent creation extra empty elements in operands[] 
        operands[operationIndex] = '-'
        return
    }
    if (operandsRegExp.test(expLast)) {
        operands[operationIndex] += expLast
        console.log(operands)
    } else if (operatorsRegExp.test(expLast)) {
        operators[operationIndex] = expLast
        console.log(operators)
        operationIndex++
    }
}

function outputAnswer(answer) {
    outputSecondary.value = answer
}

function calculateAnswer() {
    let answer
    let operationResult
    let operandsClone = operands.slice()
    let operatorsClone = operators.slice()
    const firstPriorityRegExp = /[\*\/]/
    let index = 0

    // Performing first priority operations
    function findHelper(el) {return firstPriorityRegExp.test(el)}
    while (operatorsClone.findIndex(findHelper) !== -1) {
        let operator = operatorsClone[index]
        if (!(firstPriorityRegExp.test(operator))) {
            index++
            continue
        }
        let firstOperand = parseFloat(operandsClone[index])
        let secondOperand = parseFloat(operandsClone[index+1])
        if (Number.isNaN(secondOperand)) {break}
        switch(operator) {
            case '*': 
                operationResult = firstOperand * secondOperand
                break
            case '/': 
                operationResult = firstOperand / secondOperand
                break
        }
        operandsClone.splice(index + 1, 1, operationResult)
        operandsClone.splice(index, 1)
        operatorsClone.splice(index, 1)
    }
    
    // Performing second priority operations
    while (operatorsClone.length !== 0) {
        let operator =  operatorsClone[0]
        let firstOperand = parseFloat(operandsClone[0])
        let secondOperand = parseFloat(operandsClone[1])
        if (Number.isNaN(secondOperand)) {break}
        switch(operator) {
            case '+':
                operationResult = firstOperand + secondOperand
                break
        }
        operandsClone.splice(1, 1, operationResult)
        operandsClone.splice(0, 1)
        operatorsClone.splice(0, 1)
    }    

    answer = Math.floor(operandsClone[0] * 10000000) / 10000000
    return answer
}

function answerToOutputPrimary() {
    clearVars()
    outputPrimary.value = operands[0] = outputSecondary.value
}

function allClear() {
    exp = ""
    operationIndex = 0
    operands = ['']
    operators = []
    outputPrimary.value = ''
    outputSecondary.value = ''
}

function lastClear() {
    let opValLastIndex = outputPrimary.value.length - 1
    let opValLast = outputPrimary.value[opValLastIndex]
    if (operandsRegExp.test(opValLast) || (opValLast === '-')) {
        let operandsLastIndex = operands.length - 1
        let operandsLast = operands[operandsLastIndex]
        operands[operandsLastIndex] = operandsLast.slice(0, operandsLast.length - 1)
        if (operands[operandsLastIndex] === '') {operands.pop()}
        console.log(operands)
    } else if (operatorsRegExp.test(opValLast)) {
        operators.pop()
        console.log(operators)
        operationIndex--
    }
    opVal = outputPrimary.value = outputPrimary.value.slice(0, opValLastIndex)
    if (opVal === '') {
        allClear()
    } else if (opVal === '-') {
        outputSecondary.value = ''
    } else {
        outputAnswer(calculateAnswer())
    }
}

function clearVars() {
    exp = ""
    operationIndex = 0
    operands = ['']
    operators = []
}

function  clearOutputs() {
    outputPrimary.value = ''
    outputSecondary.value = '' 
}