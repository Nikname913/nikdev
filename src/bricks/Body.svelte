<script>
  import Main from "./views/Main.svelte"
  import AllQuestions from "./views/AllQuestions.svelte"
  import MyHints from "./views/MyHints.svelte"
  import MyQuestions from "./views/MyQuestions.svelte"
  import MyCabinet from "./views/MyCabinet.svelte"
  import Unauth from "./views/Unauth.svelte"

  import About from "./views/About.svelte"
  import Polici from "./views/Polici.svelte"
  import Support from "./views/Support.svelte"

  import { pageRoute, 
    myQuestionsData, 
    contentOpacity, 
    authCheck,
    allQuestionsData 
  } from './../store/store'

  let opacity
  let route
  let myQuestions
  let allQuestions
  let UID

  let questionsData = [
    'Равным образом рамки и место обучения кадров требуют от нас анализа направлений прогрессивного развития. Задача организации, в особенности же рамки и место обучения кадров позволяет выполнять важные задания по разработке новых предложений. Значимость этих проблем настолько очевидна, что постоянный количественный рост и сфера нашей активности представляет собой интересный эксперимент проверки форм развития.',
    'Задача организации, в особенности же рамки и место обучения кадров требуют от нас анализа позиций, занимаемых участниками в отношении поставленных задач. С другой стороны реализация намеченных плановых заданий требуют определения и уточнения новых предложений. Разнообразный и богатый опыт укрепление и развитие структуры требуют определения и уточнения существенных финансовых и административных условий.',
    'Повседневная практика показывает, что укрепление и развитие структуры требуют от нас анализа модели развития. Значимость этих проблем настолько очевидна, что постоянное информационно-пропагандистское обеспечение нашей деятельности влечет за собой процесс внедрения и модернизации соответствующий условий активизации.'
  ]

  pageRoute.subscribe(value => route = value)
  authCheck.subscribe(value => UID = value.userID)
  
  const getDataQuestions = async () => {

    let updateMyQuestions = await fetch('http://localhost:3008/get-data', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=utf-8'
      },
      body: JSON.stringify({})
    })
    .then(res => res.json())

    myQuestionsData.set(updateMyQuestions.data)
    allQuestionsData.set(updateMyQuestions.data)

  }

  getDataQuestions()

  $: {

    myQuestionsData.subscribe(value => {
      console.log(value)
      myQuestions = value
    })

    allQuestionsData.subscribe(value => {
      console.log(value)
      allQuestions = value
    })

    contentOpacity.subscribe(value => {
      opacity = value
    })

  }

</script>

<section style="opacity: { opacity };" class:container={true}>
  { #if route === 'main' }

    <Main/>

  { /if }
  { #if route === 'my-questions' }

    <MyQuestions questionsData={myQuestions.filter(item => item.uid === UID)}/>

  { /if }
  { #if route === 'my-hints' }

    <MyHints 
      questionsData={
        allQuestions.filter(item => {

          let hints = item.hints
          let checker = 0

          hints.forEach(hint => {
            
            if ( hint.uid === UID) {

              checker++

            }

          })

          if ( checker === 1 ) {

            return item

          }

        })
      }
    />

  { /if }
  { #if route === 'list-questions' }

    <AllQuestions 
      questionsData={
        allQuestions
          .filter(item => item.uid !== UID)
          .filter(item => {

          let hints = item.hints
          let checker = 0

          hints.forEach(hint => {
            
            if ( hint.uid === UID) {

              checker++

            }

          })

          if ( checker === 0 ) {

            return item

          }

        })
      }
    />

  { /if }
  { #if route === 'my-cabinet' }

    <MyCabinet questionsData={questionsData}/>

  { /if }
  { #if route === 'unauth' }

    <Unauth/>

  { /if }
  { #if route === 'about' }

    <About/>

  { /if }
  { #if route === 'polici' }

    <Polici/>

  { /if }
  { #if route === 'support' }

    <Support/>

  { /if }
</section>

<style>

  .container {
    position: relative;
    width: 100%;
    max-width: 1980px;
    min-width: 1550px;
    height: calc(100vh - 80px);
    padding: 0px 100px;
    box-sizing: border-box;
    transition: all 300ms;
    padding-top: 80px;
  }

</style>