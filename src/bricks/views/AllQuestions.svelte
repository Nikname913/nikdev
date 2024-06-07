<script>

  import { pageRoute, authCheck, myQuestionsData, allQuestionsData } from "../../store/store"
  import { Divider, Modal, Dialog, StarRating, Button, RadioChipGroup } from 'attractions'
  import { onMount } from "svelte"

  // ----------------------------------------------------------------
  // <StarRating style="margin: 0 auto;" name="default" bind:value={hintRate} />
  // ----------------------------------------------------------------

  let categories = [

    // ----------------------------------------------------------------
    { value: '0', label: 'Все' },
    // ----------------------------------------------------------------
    { value: '1', label: 'Общее' },
    { value: '2', label: 'Карьера' },
    { value: '3', label: 'Личная жизнь' },
    { value: '4', label: 'Родственники' },
    { value: '5', label: 'Привычки и жизнь' },
    { value: '6', label: 'Психология' },

  ]

  let filterCategory = '0'

  let hintRate = 1
  let showModal = false

  let userAge
  let userGender
  let AUTH = false
  let UID

  let text = ''
  let sendData = false

  export let questionsData
  let questionsDataFilter = questionsData
  let questionsIndex = 0

  const changeCategory = (event) => {

    console.log(event.detail.value)
    filterCategory = event.detail.value
    questionsIndex = 0

    if ( event.detail.value != '0' ) {

      questionsDataFilter = questionsData.filter(item => item.category == filterCategory)

    } else {

      questionsDataFilter = questionsData

    }

  }

  const addHint = async () => {

    console.log(questionsData[questionsIndex].quid)

    if ( text.length >= 40 ) {

      await fetch('http://localhost:3008/add-hint', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify({ 
          uid: UID, 
          quid: questionsData[questionsIndex].quid, 
          text: text 
        })
        
      })
      .then(res => res.json())

      sendData = true

      setTimeout( async () => {
        sendData = false
        text = ''

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

        console.log(updateMyQuestions)

      }, 1000)

    } else {

      sendData = true
      
      setTimeout(() => {
        sendData = false
      }, 1000)

    }

  }

  $: {

    // ----------------------------------------------------------------
    // ----------------------------------------------------------------

    if ( filterCategory != '0' ) {

      questionsDataFilter = questionsData.filter(item => item.category == filterCategory)

    } else if ( filterCategory == '0' ) {

      questionsDataFilter = questionsData

    }

    // ----------------------------------------------------------------
    // ----------------------------------------------------------------

    authCheck.subscribe(value => {
      AUTH = value.auth
      UID = value.userID
      userAge = value.age
      userGender = value.gender
    })

    console.log(AUTH)
    console.log(UID)

  }

  onMount(() => {

    console.log(userAge)

  })

</script>

<div class:mainView={true}>
  <div class:mainViewMenu={true} style="width: 20%; padding-top: 30px;">

    { #if AUTH == true }

      <div class:mainViewMenuItem={true}>
        <span class:mainViewMenuItemLine={true}>основное меню hint</span>
        <div class:mainViewMenuItemSub={true} style="margin-top: 0px; margin-bottom: 0px;">
          <span 
            class:mainViewMenuItemLine={true} 
            style="margin-top: 11px; cursor: pointer;"
            on:click={() =>{
              pageRoute.set('my-questions')
            }}
          >
            мои вопросы
          </span>
          <span 
            class:mainViewMenuItemLine={true} 
            style="margin-top: 12px; cursor: pointer; color: #4300b0; margin-left: 30px"
          >
            *
          </span>
          <span 
            class:mainViewMenuItemLine={true} 
            style="margin-top: 6px; cursor: pointer;"
            on:click={() =>{
              pageRoute.set('my-hints')
            }}
          >
            мои хинты
          </span>
          <span 
            class:mainViewMenuItemLine={true} 
            style="margin-top: 12px; cursor: pointer; color: #4300b0; margin-left: 30px"
          >
            *
          </span>
          <span 
            class:mainViewMenuItemLine={true} 
            style="margin-top: 6px; cursor: pointer;"
            on:click={() =>{
              pageRoute.set('main')
            }}
          >
            новый вопрос
          </span>
          <span 
            class:mainViewMenuItemLine={true} 
            style="margin-top: 12px; cursor: pointer; color: #4300b0; margin-left: 30px"
          >
            *
          </span>
          <span 
            class:mainViewMenuItemLine={true} 
            style="margin-top: 6px; cursor: pointer;"
            on:click={() =>{
              pageRoute.set('list-questions')
            }}
          >
            список вопросов
            <span
              style="
                display: block;
                position: absolute;
                width: 3px;
                height: 20px;
                background-color: #4300b0;
                top: 50%;
                left: 0;
                margin-top: -10px;
                margin-left: -10px;
                border-radius: 2px;
              "
            />
          </span>
        </div>
      </div>

    { /if }

    { #if AUTH == true }

      <div class:mainViewMenuItem={true} style="margin-top: 11px;">
        <span 
          class:mainViewMenuItemLine={true} 
          style="cursor: pointer;"
          on:click={() =>{
            pageRoute.set('my-cabinet')
          }}
        >
          мои характеристики
        </span>
      </div>

    { /if }

    { #if AUTH == true }

      <div class:mainViewMenuItem={true} style="margin-top: 6px;">
        <span 
          class:mainViewMenuItemLine={true} 
          style="cursor: pointer;"
          on:click={() =>{
            pageRoute.set('unauth')
          }}
        >
          главная страница
        </span>
      </div>

    { /if }
    { #if AUTH == false }

      <div class:mainViewMenuItem={true} style="margin-top: 6px;">
        <span 
          class:mainViewMenuItemLine={true} 
          style="cursor: pointer;"
          on:click={() =>{
            pageRoute.set('unauth')
          }}
        >
          войти в аккаунт
        </span>
      </div>

    { /if }
    <span
      style="
        display: block;
        position: relative;
        width: 80%;
        height: 2px;
        background-color: gray;
        opacity: 0.4;
        border-radius: 1px;
        margin-top: 20px;
      "
    />
    <div class:mainViewMenuItem={true} style="margin-top: 18px;">
      <span 
        class:mainViewMenuItemLine={true} 
        style="cursor: pointer;"
        on:click={() =>{
          pageRoute.set('about')
        }}
      >
        о сервисе
      </span>
    </div>
    <div class:mainViewMenuItem={true} style="margin-top: 11px;">
      <span 
        class:mainViewMenuItemLine={true} 
        style="cursor: pointer;"
        on:click={() =>{
          pageRoute.set('polici')
        }}
      >
        конфиденциальность
      </span>
    </div>
    <div class:mainViewMenuItem={true} style="margin-top: 11px;">
      <span 
        class:mainViewMenuItemLine={true} 
        style="cursor: pointer;"
        on:click={() =>{
          pageRoute.set('support')
        }}
      >
        служба качества
      </span>
    </div>
  </div>
  <div class:mainViewContent={true}>
    
    <Modal bind:open={showModal} let:closeCallback>
      <Dialog title="" {closeCallback}>
        <div 
          style="
            width: 100%; 
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: flex-start;
            margin-top: 14px;
          "
        >
          <h3 style="margin-top: 28px; margin-bottom: 14px;">Насколько этот хинт был полезным</h3>
          <StarRating style="margin: 0;" name="default" bind:value={hintRate} />
          <Button 
            filled
            style="
              font-size: 15px;
              padding: 13px 22px 16px;
              margin-top: 22px;
              margin-bottom: 28px;
            "
          >Подтвердить оценку</Button>
        </div>
      </Dialog>
    </Modal>
    
    <div style="width: 100%; height: 100%; overflow: hidden;">
      <div 
        on:mousewheel={event => {
          if ( event.deltaY < 0 ) {
            
            if ( questionsIndex !== 0 ) {
              questionsIndex = questionsIndex - 1
            }

          } else {

            if ( questionsIndex < questionsDataFilter.length - 1 ) {

              questionsIndex = questionsIndex + 1

            }

          }
        }}
        style="
          width: calc(100% + 30px); 
          overflow-y: scroll; 
          padding-right: 30px; 
          box-sizing: border-box; 
          height: 100%;
        "
      >

        <h3 class:mainViewContentTitle={true}>Список всех вопросов в системе</h3>
        <div 
          style="
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: flex-start;
          "
        >
          <RadioChipGroup on:change={changeCategory} items={ categories } name="categories" />
          <svg 
            class:resetCategory={true}
            xmlns="http://www.w3.org/2000/svg" 
            height="24px" 
            viewBox="0 0 512 512"
          >
            <style>
              svg.resetCategory { 
                fill:#4300b0;
                margin-top: 5px; 
                cursor: pointer;
                display: none;
              }
            </style>
            <path 
              d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM175 175c9.4-9.4 24.6-9.4 33.9 0l47 47 47-47c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9l-47 47 47 47c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0l-47-47-47 47c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l47-47-47-47c-9.4-9.4-9.4-24.6 0-33.9z"
            />
          </svg>
        </div>

        { #if questionsDataFilter.length > 0 }

            { #if filterCategory == 0 || questionsDataFilter[questionsIndex].category == filterCategory }

              <div style="margin-top: 20px;" class:mainViewContentQuestion={true}>
                <span 
                  style="
                    color: gray; 
                    width: 100%; 
                    display: flex;
                    flex-direction: row;
                    align-items: center; 
                    margin-bottom: 13px; 
                    font-size: 13px;
                    letter-spacing: 1px;
                    font-weight: 500;
                    opacity: 0.6;
                  "
                >
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    height="24px" 
                    viewBox="0 0 512 512"
                    class:localSvg={true}
                  >
                    <style>
              
                      svg.localSvg { fill: #4300b0; }
                    
                    </style>
                    <path 
                      d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM169.8 165.3c7.9-22.3 29.1-37.3 52.8-37.3h58.3c34.9 0 63.1 28.3 63.1 63.1c0 22.6-12.1 43.5-31.7 54.8L280 264.4c-.2 13-10.9 23.6-24 23.6c-13.3 0-24-10.7-24-24V250.5c0-8.6 4.6-16.5 12.1-20.8l44.3-25.4c4.7-2.7 7.6-7.7 7.6-13.1c0-8.4-6.8-15.1-15.1-15.1H222.6c-3.4 0-6.4 2.1-7.5 5.3l-.4 1.2c-4.4 12.5-18.2 19-30.6 14.6s-19-18.2-14.6-30.6l.4-1.2zM224 352a32 32 0 1 1 64 0 32 32 0 1 1 -64 0z"
                    />
                  </svg>
                  <span style="margin-left: 11px;">вопрос 
                    { questionsDataFilter[questionsIndex].quid.split('*').join('') } | 
                    { questionsDataFilter[questionsIndex].category == 1 
                    
                      ? 'Общее'
                      : questionsDataFilter[questionsIndex].category == 2
                      ? 'Карьера'
                      : questionsDataFilter[questionsIndex].category == 3
                      ? 'Личная жизнь'
                      : questionsDataFilter[questionsIndex].category == 4 
                      ? 'Родственники'
                      : questionsDataFilter[questionsIndex].category == 5 
                      ? 'Привычки и жизнь'
                      : questionsDataFilter[questionsIndex].category == 6 
                      ? 'Психология' : 'Общий совет' }
                  </span>
                </span>

                { #if userAge >= questionsDataFilter[questionsIndex].target.age[0] 
                
                  && userAge <= questionsDataFilter[questionsIndex].target.age[1]
                  && ( 
                    
                    ( questionsDataFilter[questionsIndex].target.gender[0] == true && userGender == 'male' ) ||
                    ( questionsDataFilter[questionsIndex].target.gender[1] == true && userGender == 'female' ) 
                    
                  ) 
                  
                }
  
                  <span>{ questionsDataFilter[questionsIndex].text }</span>

                { :else }

                  <span style="filter: blur(3px)">{ questionsDataFilter[questionsIndex].text }</span>
                  <span 
                    style="
                      width: 100%; 
                      display: block;
                      color: rgb(101, 101, 101);
                      font-size: 15px;
                      opacity: 0.8;
                      margin-top: 8px;
                    "
                  >
                    {"Пожелания к характеристикам пользователей, которые могут дать ответ, отличаются от ваших. В стадии бета-тестирования вы можете видеть сам вопрос и пожелания по аудитории к нему"}
                  </span>

                { /if }

                <Divider style="margin-top: 33px; margin-bottom: 30px;" text={"написать хинт для этого вопроса - " + text.length + " символов"} />
                
                <div>
                  <span style="color: #656565; font-size: 15px; opacity: 0.8;">Предпочтения:</span>
                  <span style="color: #656565; font-size: 15px; opacity: 0.8;">возраст { questionsDataFilter[questionsIndex].target.age[0] } - { questionsDataFilter[questionsIndex].target.age[1] } *</span>
                  <span style="color: #656565; font-size: 15px; opacity: 0.8;">пол { questionsDataFilter[questionsIndex].target.gender[0] && "мужской" } { questionsDataFilter[questionsIndex].target.gender[0] && " и " } { questionsDataFilter[questionsIndex].target.gender[1] && "женский" }</span>
                </div>
                <div>
                  <span style="color: #656565; font-size: 15px; opacity: 0.8;">Стилистика ответов:</span>
                  <span style="color: #656565; font-size: 15px; opacity: 0.8;">{ questionsDataFilter[questionsIndex].target.style[0] != '' ? 'рассудительно' : '' }</span>
                  <span style="color: #656565; font-size: 15px; opacity: 0.8;">{ questionsDataFilter[questionsIndex].target.style[1] != '' ? ' * эмоционально' : '' }</span>
                  <span style="color: #656565; font-size: 15px; opacity: 0.8;">{ questionsDataFilter[questionsIndex].target.style[2] != '' ? ' * радикально' : '' }</span>
                  <span style="color: #656565; font-size: 15px; opacity: 0.8;">{ questionsDataFilter[questionsIndex].target.style[3] != '' ? ' * сдержанно' : '' }</span>
                </div>

                <div style="width: 100%; position: relative;">
                  <textarea
                    class:mainViewContentText={true}
                    type="text"
                    placeholder="Будьте собой, пишите так, как будто даете совет близкому другу, но помните, что один из главных принципов сервиса - не навредить другому. Ограничение по символам - от 40 до 1000 символов"
                    bind:value={text}
                    maxlength="1000"
                  />
                  <span
                    on:click={() => text = ''}
                    style="
                      display: flex;
                      flex-direction: row;
                      align-items: center;
                      justify-content: space-around;
                      position: absolute;
                      width: 80px;
                      height: 80px;
                      border-radius: 40px;
                      background-color: #D33639;
                      margin-top: -40px;
                      left: 100%;
                      margin-left: -40px;
                      padding-right: 5px;
                      box-sizing: border-box;
                      cursor: pointer;
                      box-shadow: 0px 3px 5px -1px rgba(0,0,0,0.2), 0px 6px 10px 0px rgba(0,0,0,0.14), 0px 1px 18px 0px rgba(0,0,0,0.12);
                    "
                  >
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      height="33px" 
                      viewBox="0 0 576 512"
                      class:svg-clear={true}
                    >
                      <style>
                        svg { fill: #fdfcf9 }
                      </style>
                      <path d="M576 128c0-35.3-28.7-64-64-64H205.3c-17 0-33.3 6.7-45.3 18.7L9.4 233.4c-6 6-9.4 14.1-9.4 22.6s3.4 16.6 9.4 22.6L160 429.3c12 12 28.3 18.7 45.3 18.7H512c35.3 0 64-28.7 64-64V128zM271 175c9.4-9.4 24.6-9.4 33.9 0l47 47 47-47c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9l-47 47 47 47c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0l-47-47-47 47c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l47-47-47-47c-9.4-9.4-9.4-24.6 0-33.9z"/>
                    </svg>
                  </span> 

                  { #if text.length >= 40 }

                    <span
                      class:sendingData={ sendData ? true : false }
                      on:click={addHint}
                      style="
                        display: flex;
                        flex-direction: row;
                        align-items: center;
                        justify-content: space-around;
                        position: absolute;
                        width: 80px;
                        height: 80px;
                        border-radius: 40px;
                        background-color: #468DA4;
                        top: 100%;
                        margin-top: -40px;
                        left: 100%;
                        margin-left: -133px;
                        padding-right: 0px;
                        box-sizing: border-box;
                        cursor: pointer;
                        box-shadow: 0px 3px 5px -1px rgba(0,0,0,0.2), 0px 6px 10px 0px rgba(0,0,0,0.14), 0px 1px 18px 0px rgba(0,0,0,0.12);
                      "
                    >
                      <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        height="33px" 
                        viewBox="0 0 512 512"
                        class:svg-ok={true}
                      >
                        <style>
                          svg { fill: #fdfcf9 }
                        </style>
                        <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM369 209L241 337c-9.4 9.4-24.6 9.4-33.9 0l-64-64c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l47 47L335 175c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9z"/>
                      </svg>
                    </span> 

                  { /if }
                  { #if text.length < 40 }

                    <span
                      style="
                        display: flex;
                        flex-direction: row;
                        align-items: center;
                        justify-content: space-around;
                        position: absolute;
                        width: 80px;
                        height: 80px;
                        border-radius: 40px;
                        background-color: #468DA4;
                        top: 100%;
                        margin-top: -40px;
                        left: 100%;
                        margin-left: -133px;
                        padding-right: 0px;
                        box-sizing: border-box;
                        cursor: pointer;
                        filter: grayscale(1);
                        box-shadow: 0px 3px 5px -1px rgba(0,0,0,0.2), 0px 6px 10px 0px rgba(0,0,0,0.14), 0px 1px 18px 0px rgba(0,0,0,0.12);
                      "
                    >
                      <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        height="33px" 
                        viewBox="0 0 512 512"
                        class:svg-ok={true}
                      >
                        <style>
                          svg { fill: #fdfcf9 }
                        </style>
                        <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM369 209L241 337c-9.4 9.4-24.6 9.4-33.9 0l-64-64c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l47 47L335 175c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9z"/>
                      </svg>
                    </span> 

                  { /if }

                </div>
              </div>

            { /if }

        { /if }

        { #if questionsDataFilter.length === 0 }

          <span style="color: gray; opacity: 0.8; margin-top: 26px; display: block;">вопросов в данной категории не обнаружено</span>

        { /if }
        { #if questionsData.length === 0 }

          <span style="color: gray; opacity: 0.8; margin-top: 26px; display: block;">вопросы не обнаружены в системе</span>

        { /if }

      </div>
    </div>

  </div>
</div>

<style>

  .mainView {
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    justify-content: flex-start;
    position: relative;
    width: 100%;
    font-family: 'Roboto', sans-serif;
    font-size: 15px;
  }
  .mainViewMenuItemSub {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
    margin-left: 16px;
  }
  .mainViewMenuItemLine {
    display: block;
    position: relative;
  }
  .mainViewContent {
    display: block;
    position: relative;
    width: 60%;
    height: calc(100vh - 80px);
    border-radius: 6px;
  }
  .mainViewContentTitle {
    margin: 0;
    font-size: 20px;
    margin-top: 30px;
    margin-bottom: 18px;
  } 
  .mainViewContentQuestion {
    display: block;
    position: relative;
    box-sizing: border-box;
    width: 100%;
    min-height: 100px;
    background-color: #FDFCF9;
    border-radius: 26px;
    padding: 30px;
    padding-top: 24px;
    line-height: 24px;
  }
  .mainViewContentText {
    display: block;
    position: relative;
    box-sizing: border-box;
    width: 100%;
    height: 240px;
    border: none;
    outline: none;
    background-color: #FDFCF9;
    box-shadow: rgba(163, 163, 163, 0.02) 10px 18px 8px, rgba(163, 163, 163, 0.07) 6px 10px 7px, rgba(163, 163, 163, 0.11) 2px 4px 5px, rgba(163, 163, 163, 0.13) 1px 1px 3px, rgba(163, 163, 163, 0.13) 0px 0px 0px;
    font-family: 'Roboto', sans-serif;
    border-radius: 26px;
    padding: 30px;
    padding-top: 24px;
    margin-top: 20px;
    line-height: 24px;
  }

  .sendingData {
    animation-name: sendData;
    animation-duration: 1s;
    animation-timing-function: linear;
    animation-iteration-count: infinite;
  }

  @keyframes sendData {
    from { transform: rotate(0deg); }

    50% { transform: rotate(180deg); }

    to { transform: rotate(360deg);}
  }

</style>