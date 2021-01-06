document.querySelector('#hit').addEventListener('click',hit)
document.querySelector('#deal').addEventListener('click',deal)
document.querySelector('#stand').addEventListener('click',stand)

let bjGame = {
    'player' : {'result': '#player-result', 'div': '#table-player', 'score': 0},
    'dealer' : {'result': '#dealer-result', 'div': '#table-dealer', 'score': 0},
    'cards' : ['2','3','4','5','6','7','8','9','10','J','Q','K','A'],
    'cardsValue': {'2':2,'3':3,'4':4,'5':5,'6':6,'7':7,'8':8,'9':9,'10':10,'J':10,'Q':10,'K':10,'A':[1,11]},
    'wins':0,
    'losses':0,
    'draws':0,
    'isStand':false,
    'turnsOver':false,
}

const PLAYER = bjGame['player'];
const DEALER = bjGame.dealer
const HITSOUND = new Audio('swish.m4a')
const WINSOUND = new Audio('cash.mp3')
const LOSSSOUND = new Audio('aww.mp3')

function hit() {
    if(bjGame['isStand']===false){
        let card = randomCard()
        showCard(PLAYER,card)
        HITSOUND.play()
        updateScore(PLAYER,card)
        showScore(PLAYER)
    }
}

function showCard(activePlayer,card) {
    if(activePlayer['score'] <= 21){
        let cardImg = document.createElement('img')
        cardImg.src = `${card}.png`
        document.querySelector(activePlayer['div']).append(cardImg)
        HITSOUND.play()
    }
}

function deal() {
  if(bjGame['turnsOver']=== true){
    bjGame['isStand'] = false
    let playerImgs = document.querySelector('#table-player').querySelectorAll('img')
    let dealerImgs = document.querySelector('#table-dealer').querySelectorAll('img')
    for( let item of playerImgs){
        item.remove()
    }
    for( let item of dealerImgs){
        item.remove()
    }
    PLAYER['score'] = 0
    DEALER['score'] = 0
    document.querySelector(PLAYER['result']).textContent = 0
    document.querySelector(DEALER['result']).textContent = 0
    document.querySelector(PLAYER['result']).style.color = '#ffffff'
    document.querySelector(DEALER['result']).style.color = '#ffffff'
    document.querySelector('#result').textContent = "Let's play"
    document.querySelector('#result').style.color ='black'
    bjGame['turnsOver'] = true
  }
}

function randomCard() {
    let randomNumber = Math.floor(Math.random()*13)
    return  bjGame['cards'][randomNumber]
}

function updateScore(activePlayer,card) {

    let A_Case_one = bjGame['cardsValue']['A'][0]
    let A_Case_eleven = bjGame['cardsValue']['A'][1]
    if(card === 'A'){
        if((activePlayer['score'] + A_Case_eleven) <= 21){
            activePlayer['score'] += A_Case_eleven
        }else {
            activePlayer['score'] += A_Case_one
        }
    }else {
        activePlayer['score'] += bjGame['cardsValue'][card]
    }

}

function showScore(activePlayer) {
    if(activePlayer['score'] > 21){
        document.querySelector(activePlayer['result']).textContent ='Busted!'
        document.querySelector(activePlayer['result']).style.color = 'red'
    }else{
        document.querySelector(activePlayer['result']).textContent = activePlayer['score']
    }
}

function showCardEverySecond(ms) {
    return new Promise(resolve => setTimeout(resolve,ms))
}

async function stand(){
    bjGame['isStand'] = true
    while (DEALER['score'] <= 16 && bjGame['isStand']===true){
        let card = randomCard()
        showCard(DEALER,card)
        updateScore(DEALER,card)
        showScore(DEALER)
        await showCardEverySecond(1000)
    }

        bjGame['turnsOver'] = true
        let winner = decideWinner()
        showResult(winner)

}

function decideWinner() {
    let winner
    if(PLAYER['score'] <=21){
        if(PLAYER['score'] > DEALER['score'] || DEALER['score'] > 21){
            winner = PLAYER
            bjGame['wins']++
        }else if (PLAYER['score'] < DEALER['score'] && DEALER['score'] <=21){
            winner = DEALER
            bjGame['losses']++
        }else if (PLAYER['score'] === DEALER['score']){
            bjGame['draws']++
        }
    }else if(PLAYER['score'] >21 && DEALER['score'] <=21){
            winner = DEALER
            bjGame['losses']++
    }else if(PLAYER['score'] >21 && DEALER['score'] >21){
            bjGame['draws']++
        }
        console.log(winner,PLAYER['score'],DEALER['score'])
    return winner
}

function showResult(winner) {
    let message, messageColor

    if (bjGame['turnsOver'] === true) {
        if(winner === PLAYER){
            message = "You Won!"
            messageColor = 'green'
            document.querySelector('#wins').textContent = bjGame['wins']
            WINSOUND.play()
        }else if(winner === DEALER){
            message = "You Lost!"
            messageColor = 'red'
            document.querySelector('#losses').textContent = bjGame['losses']
            LOSSSOUND.play()
        }else {
            message = "Drew! Let's play again!"
            document.querySelector('#draws').textContent = bjGame['draws']
        }
    document.querySelector('#result').textContent = message
    document.querySelector('#result').style.color = messageColor
    }
}
