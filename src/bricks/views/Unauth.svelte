<script>

  import { pageRoute, authCheck } from "../../store/store"
  import { Loading } from "attractions"

  let AUTH = false

  let helloDownload = true

  $: {

    authCheck.subscribe(value => AUTH = value.auth)
    console.log(AUTH)

  }

  setTimeout(() => {

    helloDownload = false

  }, 1400)

</script>

<div class:mainView={true}>

  { #if helloDownload === true }

    <div 
      style="
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: flex-start;
        position: relative;
        width: 100%;
        margin-top: 100px;
      "
    >
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        height="60px" 
        viewBox="0 0 512 512"
        class:helloLogo={true}
      >
        <style>

          svg.helloLogo { fill:#fdfcf9; margin-bottom: 20px; }
        
        </style>
        <path 
          d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM169.8 165.3c7.9-22.3 29.1-37.3 52.8-37.3h58.3c34.9 0 63.1 28.3 63.1 63.1c0 22.6-12.1 43.5-31.7 54.8L280 264.4c-.2 13-10.9 23.6-24 23.6c-13.3 0-24-10.7-24-24V250.5c0-8.6 4.6-16.5 12.1-20.8l44.3-25.4c4.7-2.7 7.6-7.7 7.6-13.1c0-8.4-6.8-15.1-15.1-15.1H222.6c-3.4 0-6.4 2.1-7.5 5.3l-.4 1.2c-4.4 12.5-18.2 19-30.6 14.6s-19-18.2-14.6-30.6l.4-1.2zM224 352a32 32 0 1 1 64 0 32 32 0 1 1 -64 0z"
        />
      </svg>
      <Loading />
    </div>

  { /if }

  { #if helloDownload === false }

    <div class:mainViewMenu={true} style="width: 20%;">

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

      <div class:mainViewMenuItem={true} style="margin-top: 6px;">
        <span 
          class:mainViewMenuItemLine={true} 
          style="cursor: pointer;"
          on:click={() =>{
            pageRoute.set('unauth')
          }}
        >
          главная страница
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

  { /if }

  { #if helloDownload === false }

    <div class:mainViewContent={true}>
      
      <h3 class:mainViewContentTitle={true}>
        <i style="font-style: normal; letter-spacing: 2px;">HINT</i> - советы онлайн по вашим вопросам
      </h3>
      <span style="color: gray; opacity: 0.8; margin-top: 26px; display: block;">приветственное сообщение для новых пользователей</span>

    </div>

  { /if }

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
    padding-top: 30px;
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
    height: calc(100vh - 200px);
    border-radius: 6px;
  }
  .mainViewContentTitle {
    margin: 0;
    font-size: 20px;
  } 

</style>