<script>

  import { authCheck, contentOpacity, pageRoute } from "../store/store"
  import { Button, Checkbox, Modal, Dialog } from "attractions"

  let modalMessage = 'Вы успешно зарегистрировались'

  // ----------------------------------------------------------------
  // ----------------------------------------------------------------

  let AUTH
  let UID

  let unauth = false
  let userMail

  let opacity
  let regActive = false
  let showModal = false
  let isRestore = false
  
  let age = ''
  let sex = 'male'
  let login = ''

  let MASTER_PASS = ''
  let RESTORE_PASS = ''
  let passValue = 'Авторизоваться'

  let regValue = 'Создать новый аккаунт'
  let logo = 'image/default.svg'

  $: {

    contentOpacity.subscribe(value => {
      opacity = value
    })

  }

  const autorization = () => {

    let sendData = { login: MASTER_PASS }

    fetch('http://localhost:3008/get-auth', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=utf-8'
      },
      body: JSON.stringify(sendData)
    })
    .then(res => res.json())
    .then(data => {

      if ( data.correct === MASTER_PASS ) {

        authCheck.set({
          auth: true,
          passID: MASTER_PASS,
          userID: MASTER_PASS,
          userMail: data.email,
          age: data.params.age,
          gender: data.params.gender,
          style: data.params.style
        })

        modalMessage = 'Вы успешно авторизовались'
        showModal = true
        contentOpacity.set(1)

        pageRoute.set('list-questions')

      } else {

        unauth = false

        modalMessage = 'Мастер-пароль не найден'
        showModal = true

      }

    })

  }

  const registration = () => {

    let sendData = {
      login, 
      age, 
      gender: sex
    }

    if ( login.length > 0 && age.length > 0 ) {

      console.log(sendData)

      fetch('http://localhost:3008/add-auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify(sendData)
      })
      .then(res => res.json())
      .then(data => {

        if ( data.uid !== 'email-uncorrect' ) {

          // ----------------------------------------------------------------
          // console.log(data)
          // showModal = true
          // contentOpacity.set(1)
          // ----------------------------------------------------------------

          // ----------------------------------------------------------------
          // authCheck.set({
          //   auth: true,
          //   passID: data.uid,
          //   userID: data.uid,
          //   userMail: login
          // })
          // ----------------------------------------------------------------

          // ----------------------------------------------------------------
          // pageRoute.set('my-cabinet')
          // ----------------------------------------------------------------

          modalMessage = `
            все отлично - проверьте ваш email, отправили доступы
          `
          showModal = true
          contentOpacity.set(1)

        } else {

          login = 'почта уже используется в системе'

        }
      
      })

    } else {

      regValue = 'Заполните все данные'
      setTimeout(() => {
        regValue = 'Создать новый аккаунт'
      }, 2000)

    }

  }

  $: {

    authCheck.subscribe(value => {
      
      AUTH = value.auth
      UID = value.userID
      userMail = value.userMail
    
    })

    if ( AUTH == false ) {

      pageRoute.set('unauth')

    }

  }

</script>

<section style="height: { opacity == 1 ? 80 : 600 }px;" class:header={true}>

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
        <h3 style="margin-top: 28px; margin-bottom: 20px;">{ modalMessage }</h3>
        <svg 
          class:bellIcon={true}
          xmlns="http://www.w3.org/2000/svg" 
          height="33px" 
          viewBox="0 0 448 512"
        >
          <style>
            svg.bellIcon{
              fill:#4300b0;
              margin-bottom:12px;
            }
          </style>
          <path d="M224 0c-17.7 0-32 14.3-32 32V51.2C119 66 64 130.6 64 208v18.8c0 47-17.3 92.4-48.5 127.6l-7.4 8.3c-8.4 9.4-10.4 22.9-5.3 34.4S19.4 416 32 416H416c12.6 0 24-7.4 29.2-18.9s3.1-25-5.3-34.4l-7.4-8.3C401.3 319.2 384 273.9 384 226.8V208c0-77.4-55-142-128-156.8V32c0-17.7-14.3-32-32-32zm45.3 493.3c12-12 18.7-28.3 18.7-45.3H224 160c0 17 6.7 33.3 18.7 45.3s28.3 18.7 45.3 18.7s33.3-6.7 45.3-18.7z"/>
        </svg>

        { #if unauth === false }

          <Button 
            filled
            style="
              font-size: 15px;
              padding: 13px 42px 16px;
              margin-top: 13px;
              margin-bottom: 20px;
            "
            on:click={() => showModal = false}
          >Все понятно спасибо</Button>

        { /if }
        { #if unauth === true }

          <Button 
            filled
            style="
              font-size: 15px;
              padding: 13px 42px 16px;
              margin-top: 13px;
              margin-bottom: 20px;
            "
            on:click={() => { 
              
              showModal = false
              authCheck.set({
                auth: false,
                passID: 'none',
                userID: 'none'
              })
              
            }}
          >Выйти из аккаунта</Button>

        { /if }

        <span 
          style="
            color: gray; 
            opacity: 0.6; 
            margin-bottom: 28px;
            cursor: pointer;
          "
        >
          Помощь в использовании
        </span>
      </div>
    </Dialog>
  </Modal>

  <div class:headerLogo={true}>
    <img
      alt=""
      src={logo}
      style="
        width: 160px;
        margin-left: -22px;
      "
    />

    { #if AUTH == false }

      <span 
        on:click={() => {

          if ( !authCheck.auth ) {
            contentOpacity.set(0)
          }

        }}
        style="
          color: #FDFCF9; 
          letter-spacing: 1px; 
          cursor: pointer;
          display: block;
          position: absolute;
          left: 100%;
          margin-left: -400px;
          margin-top: -5px;
        "
      >
        войти в систему
      </span>

    { /if }
    { #if AUTH == true }

      <span 
        on:click={() => {

          modalMessage = 'Хотите выйти из аккаунта?'
          unauth = true
          showModal = true

        }}
        style="
          color: #FDFCF9; 
          letter-spacing: 1px; 
          cursor: pointer;
          display: block;
          position: absolute;
          left: 100%;
          margin-left: -400px;
          margin-top: -20px;
        "
      >
        { UID } 
        <span
          style="
            display: block;
            position: absolute;
            opacity: 0.8;
            font-size: 14px;
            margin-top: 3px;
          "
        >
          { userMail }
        </span>
        <svg 
          class:userIcon={true}
          xmlns="http://www.w3.org/2000/svg" 
          height="36px" 
          viewBox="0 0 448 512"
        >
          <style>
            svg.userIcon{
              fill:#ffffff;
              display: block;
              position: absolute;
              top: 0;
              left: 0;
              margin-left: -48px;
              margin-top: 4.4px;
            }
          </style>
          <path d="M370.7 96.1C346.1 39.5 289.7 0 224 0S101.9 39.5 77.3 96.1C60.9 97.5 48 111.2 48 128v64c0 16.8 12.9 30.5 29.3 31.9C101.9 280.5 158.3 320 224 320s122.1-39.5 146.7-96.1c16.4-1.4 29.3-15.1 29.3-31.9V128c0-16.8-12.9-30.5-29.3-31.9zM336 144v16c0 53-43 96-96 96H208c-53 0-96-43-96-96V144c0-26.5 21.5-48 48-48H288c26.5 0 48 21.5 48 48zM189.3 162.7l-6-21.2c-.9-3.3-3.9-5.5-7.3-5.5s-6.4 2.2-7.3 5.5l-6 21.2-21.2 6c-3.3 .9-5.5 3.9-5.5 7.3s2.2 6.4 5.5 7.3l21.2 6 6 21.2c.9 3.3 3.9 5.5 7.3 5.5s6.4-2.2 7.3-5.5l6-21.2 21.2-6c3.3-.9 5.5-3.9 5.5-7.3s-2.2-6.4-5.5-7.3l-21.2-6zM112.7 316.5C46.7 342.6 0 407 0 482.3C0 498.7 13.3 512 29.7 512H128V448c0-17.7 14.3-32 32-32H288c17.7 0 32 14.3 32 32v64l98.3 0c16.4 0 29.7-13.3 29.7-29.7c0-75.3-46.7-139.7-112.7-165.8C303.9 338.8 265.5 352 224 352s-79.9-13.2-111.3-35.5zM176 448c-8.8 0-16 7.2-16 16v48h32V464c0-8.8-7.2-16-16-16zm96 32a16 16 0 1 0 0-32 16 16 0 1 0 0 32z"/>
        </svg>
      </span>

    { /if }

  </div>
  { #if opacity == 0 } 

    <div class:authForm={true}>
      
      { #if regActive === false }

        { #if isRestore == false }

          <input 
            bind:value={MASTER_PASS}
            type="text"
            maxlength="100"
            placeholder="Введите ваш мастер-пароль от системы"
            style="
              display: block;
              position: relative;
              box-sizing: border-box;
              width: 100%;
              height: 48px;
              border: none;
              outline: none;
              text-align: center;
              border-radius: 6px;
              background-color: transparent;
              letter-spacing: 0.8px;
              border-bottom: 2px solid rgb(67, 0, 176);
            "
          />

        { /if }

        { #if isRestore == true }

          <input 
            bind:value={RESTORE_PASS}
            type="text"
            maxlength="100"
            placeholder="Введите email - тот на который регистрировались"
            style="
              display: block;
              position: relative;
              box-sizing: border-box;
              width: 100%;
              height: 48px;
              border: none;
              outline: none;
              text-align: center;
              border-radius: 6px;
              background-color: transparent;
              letter-spacing: 0.8px;
              border-bottom: 2px solid rgb(67, 0, 176);
            "
          />

        { /if }

        <div 
          style="
            display: flex;
            flex-direction: row;
            align-items: center;
            margin-top: 30px;
          "
        >

          { #if isRestore == false }

            <Button 
              on:click={() => {

                if ( MASTER_PASS.length < 10 ) {

                  passValue = 'Введите пароль'
                  setTimeout(() => {
                    passValue = 'Авторизоваться'
                  }, 2000)

                } else {

                  autorization()

                }

              }}
              disabled={regActive}
              filled
              style="
                font-size: 15px;
                padding: 13px 22px 16px;
              "
            >{ passValue }</Button>

          { /if }
          { #if isRestore == true }

            <Button 
              on:click={() => {}}
              disabled={true}
              filled
              style="
                font-size: 15px;
                padding: 13px 22px 16px;
              "
            >{"Восстановить пароль"}</Button>

          { /if }

          { #if isRestore == false }

            <span 
              on:click={() => isRestore = true}
              style="
                color: gray; 
                opacity: 0.8; 
                cursor: pointer;
                display: block;
                margin-left: 20px;
                margin-right: 13px;
              "
            >
              Помогите вспомнить пароль
            </span>

          { /if }
          { #if isRestore == true }

            <span 
              on:click={() => isRestore = false}
              style="
                color: gray; 
                opacity: 0.8; 
                cursor: pointer;
                display: block;
                margin-left: 20px;
                margin-right: 13px;
              "
            >
              Вернуться назад к авторизации
            </span>

          { /if }

          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            height="22px" 
            viewBox="0 0 512 512"
          >
            <style>

              svg { fill: gray; cursor: pointer; }
            
            </style>
            <path 
              d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM169.8 165.3c7.9-22.3 29.1-37.3 52.8-37.3h58.3c34.9 0 63.1 28.3 63.1 63.1c0 22.6-12.1 43.5-31.7 54.8L280 264.4c-.2 13-10.9 23.6-24 23.6c-13.3 0-24-10.7-24-24V250.5c0-8.6 4.6-16.5 12.1-20.8l44.3-25.4c4.7-2.7 7.6-7.7 7.6-13.1c0-8.4-6.8-15.1-15.1-15.1H222.6c-3.4 0-6.4 2.1-7.5 5.3l-.4 1.2c-4.4 12.5-18.2 19-30.6 14.6s-19-18.2-14.6-30.6l.4-1.2zM224 352a32 32 0 1 1 64 0 32 32 0 1 1 -64 0z"
            />
          </svg>
        </div>
        <span 
          style="
            color: gray; 
            opacity: 0.8; 
            cursor: pointer;
            display: block;
            margin-top: 25px;
            margin-bottom: 31.1px;
          "
        >
          Чтобы зарегистрироваться в системе, нажмите на кнопку ниже
        </span>

      { /if }

      <div 
        style="
          display: flex;
          flex-direction: row;
          align-items: center;
          margin-top: 0px;
        "
      >
        <Button 
          on:click={() => {
            regActive = true
          }}
          disabled={regActive}
          filled
          style="
            font-size: 15px;
            padding: 13px 22px 16px;
          "
        >{"Зарегистрироваться"}</Button>
        <span 
          on:click={() => {
            pageRoute.set('about')
            contentOpacity.set(1)
          }}
          style="
            color: gray; 
            opacity: 0.8; 
            cursor: pointer;
            display: block;
            margin-left: 20px;
            margin-right: 13px;
          "
        >
          Простые правила нашего сервиса
        </span>
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          height="22px" 
          viewBox="0 0 512 512"
        >
          <style>

            svg { fill: gray; cursor: pointer; }
          
          </style>
          <path 
            d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM169.8 165.3c7.9-22.3 29.1-37.3 52.8-37.3h58.3c34.9 0 63.1 28.3 63.1 63.1c0 22.6-12.1 43.5-31.7 54.8L280 264.4c-.2 13-10.9 23.6-24 23.6c-13.3 0-24-10.7-24-24V250.5c0-8.6 4.6-16.5 12.1-20.8l44.3-25.4c4.7-2.7 7.6-7.7 7.6-13.1c0-8.4-6.8-15.1-15.1-15.1H222.6c-3.4 0-6.4 2.1-7.5 5.3l-.4 1.2c-4.4 12.5-18.2 19-30.6 14.6s-19-18.2-14.6-30.6l.4-1.2zM224 352a32 32 0 1 1 64 0 32 32 0 1 1 -64 0z"
          />
        </svg>
      </div>

      { #if regActive === true }

        <div>
          <input 
            bind:value={login}
            type="text"
            maxlength="100"
            placeholder="Введите адрес вашей электронной почты для связи"
            style="
              display: block;
              position: relative;
              box-sizing: border-box;
              height: 48px;
              text-align: center;
              width: 100%;
              border: none;
              outline: none;
              border-radius: 6px;
              background-color: transparent;
              letter-spacing: 0.8px;
              margin-top: 24px;
              border-bottom: 2px solid rgb(67, 0, 176);
            "
          />
          <div style="margin-top: 30px; display: flex; flex-direction: row; align-items: center;">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              height="70px" 
              viewBox="0 0 320 512"
              class:svgMale={true}
              on:click={() => sex = 'male'}
            >
              { #if sex == 'male' }
                <style>svg.svgMale{fill:#4300b0;cursor:pointer;}</style>
              { /if }
              { #if sex == 'female' }
                <style>svg.svgMale{fill:#323835;cursor:pointer;}</style>
              { /if }
              <path d="M112 48a48 48 0 1 1 96 0 48 48 0 1 1 -96 0zm40 304V480c0 17.7-14.3 32-32 32s-32-14.3-32-32V256.9L59.4 304.5c-9.1 15.1-28.8 20-43.9 10.9s-20-28.8-10.9-43.9l58.3-97c17.4-28.9 48.6-46.6 82.3-46.6h29.7c33.7 0 64.9 17.7 82.3 46.6l58.3 97c9.1 15.1 4.2 34.8-10.9 43.9s-34.8 4.2-43.9-10.9L232 256.9V480c0 17.7-14.3 32-32 32s-32-14.3-32-32V352H152z"/>
            </svg>
            <span style="margin-left: 26px; margin-right: 28px;">выберите ваш пол</span>
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              height="70px" 
              viewBox="0 0 320 512"
              class:svgfemale={true}
              on:click={() => sex = 'female'}
            >
              { #if sex == 'male' }
                <style>svg.svgfemale{fill:#323835;cursor:pointer;}</style>
              { /if }
              { #if sex == 'female' }
                <style>svg.svgfemale{fill:#4300b0;cursor:pointer;}</style>
              { /if }
              <path d="M160 0a48 48 0 1 1 0 96 48 48 0 1 1 0-96zM88 384H70.2c-10.9 0-18.6-10.7-15.2-21.1L93.3 248.1 59.4 304.5c-9.1 15.1-28.8 20-43.9 10.9s-20-28.8-10.9-43.9l53.6-89.2c20.3-33.7 56.7-54.3 96-54.3h11.6c39.3 0 75.7 20.6 96 54.3l53.6 89.2c9.1 15.1 4.2 34.8-10.9 43.9s-34.8 4.2-43.9-10.9l-33.9-56.3L265 362.9c3.5 10.4-4.3 21.1-15.2 21.1H232v96c0 17.7-14.3 32-32 32s-32-14.3-32-32V384H152v96c0 17.7-14.3 32-32 32s-32-14.3-32-32V384z"/>
            </svg>
            <Checkbox
              disabled
              name="male"
              value="male"
              title="select male"
              selectorStyle="
                border: 2px solid #4300B0;
                width: 19px;
                height: 19px;
                margin-left: 28px;
                margin-right: 11px;
              "
            >
              <span style="font-size: 14px;">Пол не указан</span>
            </Checkbox>
          </div>
          <div style="margin-top: 36px; display: flex; flex-direction: row; align-items: center;">
            <span>Укажите ваш возраст</span>
            <input 
              bind:value={age}
              type="text" 
              maxlength="2"
              placeholder="30"
              style="
                display: block;
                position: relative;
                box-sizing: border-box;
                width: 60px;
                height: 44px;
                text-align: center;
                border: none;
                outline: none;
                border-radius: 6px;
                background-color: #FDFCF9;
                margin-left: 28px;
              " 
            />
            <Checkbox
              disabled
              name="male"
              value="male"
              title="select male"
              selectorStyle="
                border: 2px solid #4300B0;
                width: 19px;
                height: 19px;
                margin-left: 28px;
                margin-right: 11px;
              "
            >
              <span style="font-size: 14px;">Возраст не указан</span>
            </Checkbox>
          </div>
          <div
            style="
              display: flex;
              flex-direction: row;
              align-items: center;
              margin-top: 30px;
            "
          >
            <Button 
              on:click={registration}
              filled
              style="
                font-size: 15px;
                padding: 13px 22px 16px;
              "
            >{ regValue }</Button>
            <span 
              on:click={() => {
                regActive = false
              }}
              style="
                color: gray; 
                opacity: 0.8; 
                cursor: pointer;
                display: block;
                margin-left: 20px;
                margin-right: 13px;
              "
            >
              Вернуться назад
            </span>
          </div>
        </div>
      
      { /if }

    </div>

  { /if }
  { #if opacity == 0 } 
    <span
      on:click={() => contentOpacity.set(1)}
      style="
        display: block;
        position: absolute;
        box-sizing: border-box;
        color: gray;
        opacity: 0.6;
        width: 300px;
        left: 50%;
        margin-left: -150px;
        text-align: center;
        cursor: pointer;
        top: 100%;
        margin-top: -44px;
      "
    >
      свернуть окно авторизации
    </span>
  { /if }
</section>

<style>

  .header {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    box-sizing: border-box;
    position: absolute;
    transition: all 300ms;
    width: 100%;
    max-width: 1980px;
    min-width: 1550px;
    background-color: #323835;
    box-shadow: 0px 0px 5px #323835;
    padding: 10px 100px;
    z-index: 10;
    overflow: hidden;
  }
  .headerLogo {
    display: flex;
    flex-direction: row;
    align-items: center;
  }
  .authForm {
    display: block;
    position: absolute;
    width: 600px;
    height: auto;
    min-height: 120px;
    background-color: #D7DDDC;
    left: 50%;
    margin-left: -300px;
    border-radius: 6px;
    padding: 30px;
  }

</style>