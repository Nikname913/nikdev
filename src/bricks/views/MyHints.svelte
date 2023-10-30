<script>

  import { pageRoute, authCheck } from "../../store/store"
  import { Divider, Modal, Dialog, StarRating, Button } from 'attractions'

  // <StarRating style="margin: 0 auto;" name="restaurant" bind:value={hintRate} />

  let hintRate = 1
  let showModal = false
  let AUTH = false
  let UID

  export let questionsData
  let questionsIndex = 0

  $: {

    authCheck.subscribe(value => {
      AUTH = value.auth
      UID = value.userID
    })

    console.log(AUTH)
    console.log(UID)

  }

</script>

<div class:mainView={true}>
  <div class:mainViewMenu={true} style="width: 20%; padding-top: 30px;">

    { #if AUTH == true }

      <div class:mainViewMenuItem={true}>
        <span class:mainViewMenuItemLine={true}>все хинты</span>
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
          <h3 style="margin-top: 28px; margin-bottom: 14px;">Насколько этот хинт был полезным</h3>
          <StarRating style="margin: 0;" name="restaurant" bind:value={hintRate} />
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

        <h3 class:mainViewContentTitle={true}>Мои ответы для пользователей</h3>

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
              <span style="margin-left: 11px;">вопрос 
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
            <Divider style="margin-top: 30px; margin-bottom: 40px;" text="мой хинт на данный вопрос" />
            
            <div style="display: flex; flex-direction: column; align-items: center; margin-bottom: 8px;">
              <span class:mainViewContentHint={true}>
                { questionsData[questionsIndex].hints.filter(hintOne => hintOne.uid === UID)[0].hint }
              </span>
              <span style="cursor: pointer; color: gray; opacity: 0.6;">* * *</span>
            </div>
          </div>

        { /if }

        { #if questionsData.length === 0 }

          <span style="color: gray; opacity: 0.8; margin-top: 26px; display: block;">вы пока не дали ни одного ответа</span>

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