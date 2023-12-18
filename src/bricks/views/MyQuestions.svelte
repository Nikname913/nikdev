<script>

  import { pageRoute, authCheck } from "../../store/store"
  import { Divider, Modal, Dialog, StarRating, Button } from 'attractions'

  // <StarRating style="margin: 0 auto;" name="default" bind:value={hintRate} />

  let hintRate = 5
  let hintUID = ''
  let hintText = ''
  let showModal = false

  export let questionsData
  let questionsIndex = 0
  
  let AUTH = false
  let UID = ''

  const sendRateItem = () => {

    fetch('http://localhost:3008/add-data-rate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify({
          uid: hintUID,
          rate: hintRate,
          from: UID,
          text: hintText
        })
      })
      .then(res => res.json())
      .then(data => {

        console.log(data)
        showModal = false

      })

  }

  $: {

    authCheck.subscribe(value => {
      AUTH = value.auth
      UID = value.userID
    })
    console.log(AUTH)

  }

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
          <h3 style="margin-top: 28px; margin-bottom: 20px;">Насколько этот хинт был полезным</h3>
          <StarRating name="default" bind:value={hintRate} />
          <Button 
            on:click={sendRateItem}
            filled
            style="
              font-size: 15px;
              padding: 13px 22px 16px;
              margin-top: 28px;
              margin-bottom: 20px;
            "
          >Поставить оценку хинту</Button>
          <span 
            style="
              color: gray; 
              opacity: 0.6; 
              margin-bottom: 28px;
              cursor: pointer;
            "
          >
            Пожаловаться на этот хинт
          </span>
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

            if ( questionsIndex < questionsData.length - 1 ) {

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

        <h3 class:mainViewContentTitle={true}>Мои вопросы в системе</h3>

        { #if questionsData.length > 0 }

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
              <span style="margin-left: 11px;">
                вопрос 
                { questionsData[questionsIndex].quid.split('*').join('') } | 
                { questionsData[questionsIndex].category == 1 
                
                  ? 'Общее'
                  : questionsData[questionsIndex].category == 2
                  ? 'Карьера'
                  : questionsData[questionsIndex].category == 3
                  ? 'Личная жизнь'
                  : questionsData[questionsIndex].category == 4 
                  ? 'Родственники'
                  : questionsData[questionsIndex].category == 5 
                  ? 'Привычки и жизнь'
                  : questionsData[questionsIndex].category == 6 
                  ? 'Психология' : 'Общий совет' }
              </span>
            </span>
            <span>{ questionsData[questionsIndex].text }</span>

            <Divider style="margin-top: 30px; margin-bottom: 40px;" text="хинты на данный вопрос" />
            
            { #if questionsData[questionsIndex].hints.length === 0 }

              <span 
                style="
                  width: 100%; 
                  text-align: center; 
                  display: block;
                  margin-bottom: 15px;
                "
              >
                На ваш вопрос пока не было хинтов
              </span>

            { /if}

            { #each questionsData[questionsIndex].hints as hint }
              
              <div style="display: flex; flex-direction: column; align-items: center; margin-bottom: 26px;">
                <span class:mainViewContentHint={true}>
                  { hint.hint }
                </span>
                <div 
                  on:click={() => {
                    showModal = true
                    hintUID = hint.uid
                    hintText = hint.hint
                  }} 
                  style="display: flex; flex-direction: row; align-items: center;"
                >
                  <span 
                    style="
                      cursor: pointer;
                      margin-right: 10px;
                    "
                  >
                    Оценить этот хинт
                  </span>
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    height="22px" 
                    viewBox="0 0 512 512"
                    class:svgLike={true}
                  >
                    <style>svg.svgLike { fill: #4300b0; opacity: 0.6; margin-top: -5px; cursor: pointer; }</style>
                    <path d="M313.4 32.9c26 5.2 42.9 30.5 37.7 56.5l-2.3 11.4c-5.3 26.7-15.1 52.1-28.8 75.2H464c26.5 0 48 21.5 48 48c0 18.5-10.5 34.6-25.9 42.6C497 275.4 504 288.9 504 304c0 23.4-16.8 42.9-38.9 47.1c4.4 7.3 6.9 15.8 6.9 24.9c0 21.3-13.9 39.4-33.1 45.6c.7 3.3 1.1 6.8 1.1 10.4c0 26.5-21.5 48-48 48H294.5c-19 0-37.5-5.6-53.3-16.1l-38.5-25.7C176 420.4 160 390.4 160 358.3V320 272 247.1c0-29.2 13.3-56.7 36-75l7.4-5.9c26.5-21.2 44.6-51 51.2-84.2l2.3-11.4c5.2-26 30.5-42.9 56.5-37.7zM32 192H96c17.7 0 32 14.3 32 32V448c0 17.7-14.3 32-32 32H32c-17.7 0-32-14.3-32-32V224c0-17.7 14.3-32 32-32z"/>
                  </svg>
                </div>
                <div 
                  on:click={() => {}} 
                  style="display: flex; flex-direction: row; align-items: center;"
                >
                  <span 
                    style="
                      cursor: pointer;
                      color: gray;
                      opacity: 0.6;
                      text-align: center;
                      margin-top: 10px;
                    "
                  >
                    На данном этапе вы можете многократно оценивать каждый хинт - оценки в таком случае не будут суммироваться, а просто произойдет перезапись для каждого хинта
                  </span>
                </div>
              </div>

            {/each }
            
          </div>

        { /if }

        { #if questionsData.length === 0 }

          <span style="color: gray; opacity: 0.8; margin-top: 26px; display: block;">вы пока не опубликовали ни одного вопроса</span>

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
    height: calc(100vh - 190px);
    border-radius: 6px;
  }
  .mainViewContentTitle {
    margin: 0;
    font-size: 20px;
    margin-top: 30px;
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
  .mainViewContentHint {
    display: block;
    position: relative;
    box-sizing: border-box;
    width: 100%;
    min-height: 60px;
    background-color: #468DA4;
    color: #FDFCF9;
    border-radius: 20px;
    padding: 26px;
    padding-top: 24px;
    text-align: center;
    margin-bottom: 13px;
  }

</style>