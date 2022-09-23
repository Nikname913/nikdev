<script>

  import MessageFrom from "./MessageFrom.svelte"
  import MessageTo from "./MessageTo.svelte"
  import { afterUpdate } from 'svelte'
  import messages from '../data/messages.js'

  let chatScroll
  let dialog = []
  let answers = [
    { text: 'какие проекты ты выполнял, где работал?', id: '2' },
    { text: 'расскажи, какой стек ты используешь', id: '1' },
    { text: 'что насчет разработки новых сайтов?', id: '3' },
    { text: 'сколько стоит сделать мне приложение?', id: '4' },
    { text: 'сколько будет стоить разработка мобильного приложения?', id: '6' },
  ]

  $: { 
    
    dialog 
    answers 
  
  }

  let { startMessages, 
    otherMessagesOne, 
    otherMessagesTwo, 
    otherMessagesThree, 
    otherMessagesFour, 
    otherMessagesFive, 
    otherMessagesSix, 
    otherMessagesSeven } = messages
  let startDate = new Date()
  let startTime = ''

  startDate.getMinutes() < 10 
  ? startTime = `${startDate.getHours()} : 0${startDate.getMinutes()}`
  : startTime = `${startDate.getHours()} : ${startDate.getMinutes()}`

  function changeAnswers(param) {

    let { id, type, text } = param

    switch(id) {

      case '1':

        let date1 = new Date()
        let time1 = ''
        
        date1.getMinutes() < 10
        ? time1 = `${date1.getHours()} : 0${date1.getMinutes()}`
        : time1 = `${date1.getHours()} : ${date1.getMinutes()}`
        let message1 = text + '::' + time1

        dialog.push({ type, text: message1 })
        dialog = dialog

        setTimeout(() => {

          otherMessagesOne.forEach(item => {

            let date = new Date()
            let time = ''

            date.getMinutes() < 10
            ? time = `${date.getHours()} : 0${date.getMinutes()}`
            : time = `${date.getHours()} : ${date.getMinutes()}`
            item.text = item.text + '::' + time

            dialog.push(item)

          }); dialog = dialog

        }, 1200)

        answers.forEach(item => {

          if ( item.id === id ) { item.id = '0' }

        })
        
        answers.push({ text: 'можно посмотреть твой профиль на github или gitlab, что-то такое?', id: '5' })
        answers = answers

        break

      case '2':

        let date2 = new Date()
        let time2 = ''
        
        date2.getMinutes() < 10
        ? time2 = `${date2.getHours()} : 0${date2.getMinutes()}`
        : time2 = `${date2.getHours()} : ${date2.getMinutes()}`
        let message2 = text + '::' + time2

        dialog.push({ type, text: message2 })
        dialog = dialog

        setTimeout(() => {

          otherMessagesTwo.forEach(item => {

            let date = new Date()
            let time = ''

            date.getMinutes() < 10
            ? time = `${date.getHours()} : 0${date.getMinutes()}`
            : time = `${date.getHours()} : ${date.getMinutes()}`
            item.text = item.text + '::' + time

            dialog.push(item)

          }); dialog = dialog

        }, 1200)

        answers.forEach(item => {

          if ( item.id === id ) { item.id = '0' }

        }); answers = answers

        break

      case '3':

        let date3 = new Date()
        let time3 = ''

        date3.getMinutes() < 10
        ? time3 = `${date3.getHours()} : 0${date3.getMinutes()}`
        : time3 = `${date3.getHours()} : ${date3.getMinutes()}` 
        let message3 = text + '::' + time3

        dialog.push({ type, text: message3 })
        dialog = dialog

        setTimeout(() => {

          otherMessagesThree.forEach(item => { 
            
            let date = new Date()
            let time = ''

            date.getMinutes() < 10
            ? time = `${date.getHours()} : 0${date.getMinutes()}`
            : time = `${date.getHours()} : ${date.getMinutes()}`
            item.text = item.text + '::' + time

            dialog.push(item)
          
          }); dialog = dialog

        }, 1200)

        answers.forEach(item => {

          if ( item.id === id ) { item.id = '0' }

        })
        
        answers.push({ text: 'можешь сказать какие расценки на сайты?', id: '7' })
        answers = answers

        break
      
      case '4':

        let date4 = new Date()
        let time4 = ''
        
        date4.getMinutes() < 10
        ? time4 = `${date4.getHours()} : 0${date4.getMinutes()}`
        : time4 = `${date4.getHours()} : ${date4.getMinutes()}`
        let message4 = text + '::' + time4

        dialog.push({ type, text: message4 })
        dialog = dialog

        setTimeout(() => {

          otherMessagesFour.forEach(item => { 
            
            let date = new Date()
            let time = ''

            date.getMinutes() < 10
            ? time = `${date.getHours()} : 0${date.getMinutes()}`
            : time = `${date.getHours()} : ${date.getMinutes()}`
            item.text = item.text + '::' + time

            dialog.push(item)
          
          }); dialog = dialog

        }, 1200)

        answers.forEach(item => {

          if ( item.id === id ) { item.id = '0' }

        }); answers = answers

        break

      case '5':

        let date5 = new Date()
        let time5 = ''

        date5.getMinutes() < 10
        ? time5 = `${date5.getHours()} : 0${date5.getMinutes()}`
        : time5 = `${date5.getHours()} : ${date5.getMinutes()}`
        let message5 = text + '::' + time5

        dialog.push({ type, text: message5 })
        dialog = dialog

        setTimeout(() => {

          otherMessagesFive.forEach(item => {

            let date = new Date()
            let time = ''

            date.getMinutes() < 10
            ? time = `${date.getHours()} : 0${date.getMinutes()}`
            : time = `${date.getHours()} : ${date.getMinutes()}`
            item.text = item.text + '::' + time

            dialog.push(item)

          }); dialog = dialog

        }, 1200)

        answers.forEach(item => {

          if ( item.id === id ) { item.id = '0' }

        }); answers = answers

        break

      case '6':

        let date6 = new Date()
        let time6 = ''
        
        date6.getMinutes() < 10
        ? time6 = `${date6.getHours()} : 0${date6.getMinutes()}`
        : time6 = `${date6.getHours()} : ${date6.getMinutes()}`
        let message6 = text + '::' + time6

        dialog.push({ type, text: message6 })
        dialog = dialog

        setTimeout(() => {

          otherMessagesSix.forEach(item => { 
            
            let date = new Date()
            let time = ''

            date.getMinutes() < 10
            ? time = `${date.getHours()} : 0${date.getMinutes()}`
            : time = `${date.getHours()} : ${date.getMinutes()}`
            item.text = item.text + '::' + time

            dialog.push(item)
          
          }); dialog = dialog

        }, 1200)

        answers.forEach(item => {

          if ( item.id === id ) { item.id = '0' }

        }); answers = answers

        break

      case '7':

        let date7 = new Date()
        let time7 = ''
        
        date7.getMinutes() < 10
        ? time7 = `${date7.getHours()} : 0${date7.getMinutes()}`
        : time7 = `${date7.getHours()} : ${date7.getMinutes()}`
        let message7 = text + '::' + time7

        dialog.push({ type, text: message7 })
        dialog = dialog

        setTimeout(() => {

          otherMessagesSeven.forEach(item => {

            let date = new Date()
            let time = ''

            date.getMinutes() < 10
            ? time = `${date.getHours()} : 0${date.getMinutes()}`
            : time = `${date.getHours()} : ${date.getMinutes()}`
            item.text = item.text + '::' + time

            dialog.push(item)

          }); dialog = dialog

        }, 1200)

        answers.forEach(item => {

          if ( item.id === id ) { item.id = '0' }

        }); answers = answers

        break

      default:
        break

    }

  }

  afterUpdate(() => {

    chatScroll.scrollTop = 100000

  })

</script>

<section class:chat={true}>
  <div 
    class="chatScroll" 
    bind:this={chatScroll} 
  >
    
    { #each startMessages as mes }

      <MessageFrom message={mes.message + '::' + startTime}/>

    { /each }

    { #each dialog as mes }

      { #if mes.type == 'me' }

        <MessageFrom message={mes.text}/>

      { :else }

        <MessageTo message={mes.text}/>

      { /if }

    { /each }
  
  </div>
  <div class:chatAnswers={true}>
  
    { #each answers as item }

      { #if item.id !== '0' }

        <span 
          class:answer={true}
          on:click={() => {

            changeAnswers({
              id: item.id,
              type: 'user',
              text: item.text
            })

          }} 
        >
        
          { item.text }
        
        </span>

      { /if }

    { /each }

  </div>
</section>

<style>

  .chat {
    display: block;
    position: relative;
    box-sizing: border-box;
    width: 800px;
    height: calc(100vh - 80px);
    margin: 0 auto;
    overflow: hidden;
  }
  .chatScroll {
    display: block;
    position: relative;
    box-sizing: border-box;
    width: calc(100% + 40px);
    height: 74%;
    min-height: 300px;
    overflow-x: hidden;
    overflow-y: scroll;
    padding-right: 24px;
    padding-top: 14px;
    padding-bottom: 2px;
  }
  .chatAnswers {
    display: flex;
    flex-wrap: wrap;
    flex-direction: row;
    align-items: flex-start;
    justify-content: flex-start;
    position: relative;
    box-sizing: border-box;
    width: 100%;
    height: auto;
    border-top: 1px dashed rgba(121, 106, 164, 0.4);
  }
  .answer {
    display: block;
    position: relative;
    box-sizing: border-box;
    font-size: 14px;
    background-color: #796AA4;
    border-radius: 4px;
    text-align: center;
    margin-right: 10px;
    padding: 8px;
    padding-bottom: 11px;
    padding-left: 10px;
    padding-right: 12px;
    padding-top: 7px;
    margin-top: 10px;
    margin-bottom: 0px;
  }
  .answer:hover { cursor: pointer; }

  @media screen and ( max-width: 500px ) {

    .chat { 
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: flex-start;
    }
    .chatScroll { 
      height: calc(100% - 204px); 
      height: 100%;
      padding-left: 28px; 
      padding-right: 30px;
    }
    .chatAnswers { 
      display: block;
      padding-left: 8px;
      height: 204px;
      height: auto;
      padding-bottom: 8px;
    }
    .answer { 
      display: none !important;
      text-align: center; 
      max-width: 100%; 
      margin-top: 8px;
      margin-right: 8px;
      font-size: 16px;
      padding-bottom: 22px;
      padding-left: 12px;
      padding-right: 14px;
      padding-top: 18px;
    }
    .answer:nth-child(1),
    .answer:nth-child(2),
    .answer:nth-child(3) {
      display: block !important;
    }

  }

</style>