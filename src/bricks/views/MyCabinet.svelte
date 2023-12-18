<script>

  import { pageRoute, authCheck } from "../../store/store"
  import { Modal, Dialog, StarRating, Button, Checkbox } from 'attractions'
  import { onMount } from "svelte"

  // ----------------------------------------------------------------
  // <StarRating style="margin: 0 auto;" name="default" bind:value={hintRate} />
  // ----------------------------------------------------------------

  // ----------------------------------------------------------------
  // emoParam1 ? 'rass' : ''
  // emoParam2 ? 'emo' : ''
  // emoParam3 ? 'radi' : ''
  // emoParam4 ? 'sder' : ''
  // ----------------------------------------------------------------

  let isLoading = false

  let hintRate = 5
  let showModal = false

  let sex = 'male'
  let noneGender = false

  let defaultAgeNumber
  let ageNumber = ''
  let noneAge = false

  let rass = false
  let emo = false
  let radi = false
  let sder = false

  let AUTH = false
  let userMail
  let userId
  let userRate

  export let questionsData
  let questionsIndex = 0

  const changeRass = event => rass = event.detail.checked
  const changeEmo = event => emo = event.detail.checked
  const changeRadi = event => radi = event.detail.checked
  const changeSder = event => sder = event.detail.checked

  const changeGender = (event) => {
    console.log(event.detail.checked)

    if ( event.detail.checked == true ) {

      sex = 'none'
      noneGender = true

    } else {

      sex = 'male'
      noneGender = false

    }
  }

  const changeAge = (event) => {
    console.log(event.detail.checked)

    if ( event.detail.checked == true ) {

      ageNumber = ''
      noneAge = true

    } else {

      ageNumber = '30'
      noneAge = false

    }
  }

  const validate = () => {

    isLoading = true

    console.log({
      age: ageNumber,
      gender: sex,
      style: [
        { rass },
        { emo },
        { radi },
        { sder }
      ]
    })

    fetch('http://localhost:3008/add-data-user', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=utf-8'
      },
      body: JSON.stringify({
        uid: userId,
        age: 
          ageNumber != '' 
          ? ageNumber 
          : defaultAgeNumber,
        gender: sex,
        style: [
          { rass },
          { emo },
          { radi },
          { sder }
        ]
      })
    })
    .then(res => res.json())
    .then(data => {

      authCheck.update((data) => {
        return {
          ...data,
          age: ageNumber,
          gender: sex,
          style: [
            { rass },
            { emo },
            { radi },
            { sder }
          ]
        }
      })

      setTimeout(() => {

        fetch('http://localhost:3008/send-data-user', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json;charset=utf-8'
          },
          body: JSON.stringify({ uid: userId })
        })
        .then(res => res.json())
        .then(data => {

          console.log(data)

          sex = data.body.gender
          ageNumber = data.body.age
          defaultAgeNumber = data.body.age
          userRate = data.rate.reduce((a, b) => a + b) / data.rate.length

          if ( sex == 'none' ) {

            noneGender = true

          }

          if ( data.body.style ) {

            rass = data.body.style[0].rass
            emo = data.body.style[1].emo
            radi = data.body.style[2].radi
            sder = data.body.style[3].sder

          }

          isLoading = false

        })

      }, 1000)
    
    })
    .catch(err => console.log(err))

  }

  $: {

    authCheck.subscribe(value => {
      AUTH = value.auth
      userMail = value.userMail
      userId = value.userID
    })
    console.log(AUTH)

  }

  onMount(() => {

    fetch('http://localhost:3008/send-data-user', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=utf-8'
      },
      body: JSON.stringify({ uid: userId })
    })
    .then(res => res.json())
    .then(data => {

      console.log(data)

      sex = data.body.gender
      ageNumber = data.body.age
      defaultAgeNumber = data.body.age
      userRate = data.rate.reduce((a, b) => a.rate + b.rate) / data.rate.length

      console.log(userRate)

      if ( sex == 'none' ) {

        noneGender = true

      }

      if ( data.body.style ) {

        rass = data.body.style[0].rass
        emo = data.body.style[1].emo
        radi = data.body.style[2].radi
        sder = data.body.style[3].sder

      }

    })

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
          <StarRating style="margin: 0;" name="default" value={hintRate} disabled />
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
          if ( event.deltaY == -200 ) {
            
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

        <h3 class:mainViewContentTitle={true}>
          Личный кабинет | { userMail }
          <div 
            style="
              display: flex;
              flex-direction: row;
              items-align: center;
              position: absolute;
              top: 0;
              left: 100%;
              margin-top: 20px;
              margin-left: -300px;
            "
          >
            <StarRating style="margin: 0;" name="default" value={ userRate ? Math.floor(userRate) : 5 } />
            <span style="margin-top: 7.5px; margin-left: 10px; font-size: 24px;">{ userRate ? userRate.toFixed(2) : 5 }</span>
          </div>
        </h3>
        <span style="line-height: 24px; margin-top: 20px; display: block;">
          Сервис hint - максимально обезличенный, поэтому вам не удастся настроить ваше имя, ник или аватар в виде вашей фотки. Однако сервис позволяет настроить вам ваши характеристики, как одного из представителей глобальной аудитории hint. Вам будут показываться те вопросы, таргетинг которых соответствует вашему портрету. Надеемся, что вам понравится в hint
        </span>
        <div style="margin-top: 30px; display: flex; flex-direction: row; align-items: center;">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            height="70px" 
            viewBox="0 0 320 512"
            class:svgMale={true}
            on:click={() => {
              sex = 'male'
              noneGender = false
            }}
          >
            { #if sex == 'male' }
              <style>svg.svgMale{fill:#4300b0;cursor:pointer;}</style>
            { /if }
            { #if sex == 'female' }
              <style>svg.svgMale{fill:#323835;cursor:pointer;}</style>
            { /if }
            { #if sex == 'none' }
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
            on:click={() => {
              sex = 'female'
              noneGender = false
            }}
          >
            { #if sex == 'male' }
              <style>svg.svgfemale{fill:#323835;cursor:pointer;}</style>
            { /if }
            { #if sex == 'female' }
              <style>svg.svgfemale{fill:#4300b0;cursor:pointer;}</style>
            { /if }
            { #if sex == 'none' }
              <style>svg.svgfemale{fill:#323835;cursor:pointer;}</style>
            { /if }
            <path d="M160 0a48 48 0 1 1 0 96 48 48 0 1 1 0-96zM88 384H70.2c-10.9 0-18.6-10.7-15.2-21.1L93.3 248.1 59.4 304.5c-9.1 15.1-28.8 20-43.9 10.9s-20-28.8-10.9-43.9l53.6-89.2c20.3-33.7 56.7-54.3 96-54.3h11.6c39.3 0 75.7 20.6 96 54.3l53.6 89.2c9.1 15.1 4.2 34.8-10.9 43.9s-34.8 4.2-43.9-10.9l-33.9-56.3L265 362.9c3.5 10.4-4.3 21.1-15.2 21.1H232v96c0 17.7-14.3 32-32 32s-32-14.3-32-32V384H152v96c0 17.7-14.3 32-32 32s-32-14.3-32-32V384z"/>
          </svg>
          <Checkbox
            on:change={changeGender}
            checked={noneGender}
            name="male"
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
        <hr 
          style="
            display: block;
            position: relative;
            border: none;
            background-color: gray;
            opacity: 0.4;
            height: 2px;
            box-sizing: border-box;
            border-radius: 1px;
            margin-top: 38px;
            margin-bottom: 38px;
          "
        />
        <div style="margin-top: 0px; display: flex; flex-direction: row; align-items: center;">
          <span>Укажите ваш возраст</span>
          <input 
            bind:value={ageNumber}
            disabled={noneAge}
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
            on:change={changeAge}
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
        <hr 
          style="
            display: block;
            position: relative;
            border: none;
            background-color: gray;
            opacity: 0.4;
            height: 2px;
            box-sizing: border-box;
            border-radius: 1px;
            margin-top: 38px;
            margin-bottom: 38px;
          "
        />
        <div style="display: flex; flex-direction: row; align-items: center; margin-top: 0px;">
          <span style="display: block;">
            Выберите ваш характер
          </span>
          <Checkbox
            checked={rass}
            on:change={changeRass}
            name="male"
            value="male"
            title="select male"
            selectorStyle="
              border: 2px solid #4300B0;
              width: 19px;
              height: 19px;
              margin-left: 22px;
              margin-right: 11px;
            "
          >
            <span style="font-size: 14px;">Рассудительно</span>
          </Checkbox>
          <Checkbox
            checked={emo}
            on:change={changeEmo}
            name="male"
            value="male"
            title="select male"
            selectorStyle="
              border: 2px solid #4300B0;
              width: 19px;
              height: 19px;
              margin-left: 20px;
              margin-right: 11px;
            "
          >
            <span style="font-size: 14px;">Эмоционально</span>
          </Checkbox>
          <Checkbox
            checked={radi}
            on:change={changeRadi}
            name="male"
            value="male"
            title="select male"
            selectorStyle="
              border: 2px solid #4300B0;
              width: 19px;
              height: 19px;
              margin-left: 20px;
              margin-right: 11px;
            "
          >
            <span style="font-size: 14px;">Радикально</span>
          </Checkbox>
          <Checkbox
            checked={sder}
            on:change={changeSder}
            name="male"
            value="male"
            title="select male"
            selectorStyle="
              border: 2px solid #4300B0;
              width: 19px;
              height: 19px;
              margin-left: 20px;
              margin-right: 11px;
            "
          >
            <span style="font-size: 14px;">Сдержанно</span>
          </Checkbox>
        </div>
        <div style="display: flex; flex-direction: row; align-items: center;">
          { #if isLoading === false }
            <Button 
              on:click={validate}
              filled
              style="
                font-size: 15px;
                padding: 13px 22px 16px;
                margin-top: 46px;
              "
            >Обновить личные данные</Button>
          { :else }
            <Button 
              filled
              style="
                font-size: 15px;
                padding: 13px 22px 16px;
                margin-top: 46px;
                background-color: #FDFCF9;
              "
            >Ожидание загрузки..</Button>
          { /if }
          <Button 
            filled
            disabled
            style="
              font-size: 15px;
              padding: 13px 22px 16px;
              margin-top: 46px;
              margin-left: 16px;
            "
          >Запасная кнопка на будущее</Button>
        </div>

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
    opacity: 0.8;
    letter-spacing: 1px;
  }

</style>