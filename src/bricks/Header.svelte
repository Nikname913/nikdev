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
  
  let age = ''
  let sex = 'male'
  let login = ''

  let MASTER_PASS = '7kehakbiub2cvjl7vl1isk3nzwm8nbuvi'
  let passValue = 'Авторизоваться'

  let regValue = 'Создать новый аккаунт'

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

          console.log(data)
          showModal = true
          contentOpacity.set(1)

          authCheck.set({
            auth: true,
            passID: data.uid,
            userID: data.uid,
            userMail: login
          })

          pageRoute.set('my-cabinet')

          modalMessage = `
            Сохраните ваш уникальный UID - ${ data.uid }
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
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      height="30px" 
      viewBox="0 0 512 512"
    >
      <style>

        svg { fill:#fdfcf9; }
      
      </style>
      <path 
        d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM169.8 165.3c7.9-22.3 29.1-37.3 52.8-37.3h58.3c34.9 0 63.1 28.3 63.1 63.1c0 22.6-12.1 43.5-31.7 54.8L280 264.4c-.2 13-10.9 23.6-24 23.6c-13.3 0-24-10.7-24-24V250.5c0-8.6 4.6-16.5 12.1-20.8l44.3-25.4c4.7-2.7 7.6-7.7 7.6-13.1c0-8.4-6.8-15.1-15.1-15.1H222.6c-3.4 0-6.4 2.1-7.5 5.3l-.4 1.2c-4.4 12.5-18.2 19-30.6 14.6s-19-18.2-14.6-30.6l.4-1.2zM224 352a32 32 0 1 1 64 0 32 32 0 1 1 -64 0z"
      />
    </svg>
    <h1 class:headerTitle={true}>
      hint
      <span 
        style="
          font-size: 16px;
          display: block;
          position: absolute;
          margin-top: -54px;
          margin-left: 77px;
        "
      >
        beta
      </span>
    </h1>

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

          modalMessage = 'Выйти из аккаунта?'
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
      </span>

    { /if }

  </div>
  { #if opacity == 0 } 

    <div class:authForm={true}>
      
      { #if regActive === false }

        <input 
          bind:value={MASTER_PASS}
          type="text"
          maxlength="100"
          placeholder="введите ваш мастер-пароль от системы"
          style="
            display: block;
            position: relative;
            box-sizing: border-box;
            width: 100%;
            border: none;
            outline: none;
            border-radius: 6px;
            background-color: transparent;
            letter-spacing: 0.8px;
          "
        />
        <div 
          style="
            display: flex;
            flex-direction: row;
            align-items: center;
            margin-top: 30px;
          "
        >
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
          <span 
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
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            height="22px" 
            viewBox="0 0 512 512"
          >
            <style>

              svg { fill:#gray; cursor: pointer; }
            
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

            svg { fill:#gray; cursor: pointer; }
          
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
            placeholder="введите адрес вашей электронной почты для связи"
            style="
              display: block;
              position: relative;
              box-sizing: border-box;
              width: 100%;
              border: none;
              outline: none;
              border-radius: 6px;
              background-color: transparent;
              letter-spacing: 0.8px;
              margin-top: 30px;
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
        margin-top: 20px;
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
  }
  .headerTitle {
    color: #FDFCF9;
    font-family: 'Cabin Sketch', cursive;
    font-weight: 200;
    font-size: 40px;
    letter-spacing: 2px;
    margin-left: 14px;
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