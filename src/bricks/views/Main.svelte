<script>

  import { pageRoute, authCheck, myQuestionsData, allQuestionsData } from "../../store/store"
  import { Slider, Checkbox, Button, Loading, RadioChipGroup } from 'attractions'

  const categories = [

    { value: '1', label: 'Общее' },
    { value: '2', label: 'Карьера' },
    { value: '3', label: 'Личная жизнь' },
    { value: '4', label: 'Родственники' },
    { value: '5', label: 'Привычки и жизнь' },
    { value: '6', label: 'Психология' },

  ]

  let isLoading = false
  let category = 0
  let AUTH = false
  let UID

  let valueStart = 18
  let valueEnd = 58

  let text = ''
  let male = true
  let female = true
  let emoParam1 = true
  let emoParam2 = false
  let emoParam3 = false
  let emoParam4 = false

  let sendButton = 'Создать новый вопрос'

  const changeCategory = (event) => {

    false && console.log(event.detail.value)
    category = event.detail.value

  }

  const newQuestion = () => {

    let sendData = {
      uid: UID,
      text, 
      category: category,
      count: 5,
      age: [ valueStart, valueEnd ],
      gender: [ male, female ],
      style: [
        emoParam1 ? 'rass' : '',
        emoParam2 ? 'emo' : '',
        emoParam3 ? 'radi' : '',
        emoParam4 ? 'sder' : '',
      ]
    }

    false && console.log(sendData)

    if ( text.length >= 80 
    
      && ( emoParam1 || emoParam2 || emoParam3 || emoParam4 )
      && ( male || female ) && category != 0 ) {

        isLoading = true

        fetch('http://localhost:3008/add-data', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json;charset=utf-8'
          },
          body: JSON.stringify(sendData)
        })
        .then(res => res.json())
        .then(data => {

          setTimeout( async () => {

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

            console.log(data)

            pageRoute.set('my-questions')
            
            isLoading = false
          
          }, 2000)

        })

        false && console.log('данные успешно отправлены на сервер')

    } else {

      sendButton = 'Заполните все поля'
      setTimeout(() => sendButton = 'Создать новый вопрос', 2000)

    }

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
    
    <h3 class:mainViewContentTitle={true}>Написать новый вопрос</h3>
    <RadioChipGroup on:change={changeCategory} items={ categories } name="categories" />
    <div>
      <textarea
        class:mainViewContentText={true}
        type="text"
        disabled={isLoading}
        placeholder="Напишите ваш вопрос здесь - постарайтесь лаконично но подробно все описать, ограничение 1000 символов, минимальный объем текста 150 символов"
        maxlength="1100"
        bind:value={text}
      />
      <span
        on:click={() => text = ''}
        style="
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: space-around;
          position: absolute;
          width: 66px;
          height: 66px;
          border-radius: 33px;
          background-color: #D33639;
          margin-top: -33px;
          left: 100%;
          margin-left: -33px;
          padding-right: 5px;
          box-sizing: border-box;
          cursor: pointer;
          box-shadow: 0px 3px 5px -1px rgba(0,0,0,0.2), 0px 6px 10px 0px rgba(0,0,0,0.14), 0px 1px 18px 0px rgba(0,0,0,0.12);
        "
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          height="28px" 
          viewBox="0 0 576 512"
        >
          <style>
            svg{fill:#fdfcf9}
          </style>
          <path d="M576 128c0-35.3-28.7-64-64-64H205.3c-17 0-33.3 6.7-45.3 18.7L9.4 233.4c-6 6-9.4 14.1-9.4 22.6s3.4 16.6 9.4 22.6L160 429.3c12 12 28.3 18.7 45.3 18.7H512c35.3 0 64-28.7 64-64V128zM271 175c9.4-9.4 24.6-9.4 33.9 0l47 47 47-47c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9l-47 47 47 47c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0l-47-47-47 47c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l47-47-47-47c-9.4-9.4-9.4-24.6 0-33.9z"/>
        </svg>
      </span> 
    </div>
    <div style="margin-top: 30px;">
      <div style="display: flex; flex-direction: row; align-items: center; margin-bottom: 20px;">
        <span style="display: block;">
          Выберите возраст аудитории
        </span>
        <span 
          style="
            display: block; 
            width: 60px; 
            height: 38px; 
            background-color: #FDFCF9;
            border-radius: 6px;
            font-size: 14px;
            line-height: 36px;
            text-align: center;
            margin-left: 22px;
            margin-right: 14px;
          "
        >
          { valueStart }
        </span>
        <span 
          style="
            display: block; 
            width: 60px; 
            height: 38px; 
            background-color: #FDFCF9;
            border-radius: 6px;
            font-size: 14px;
            line-height: 36px;
            text-align: center;
          "
        >
          { valueEnd }
        </span>
        <Checkbox
          name="male"
          value="male"
          checked={male}
          disabled={isLoading}
          on:change={() => male = !male}
          title="select male"
          selectorStyle="
            border: 2px solid #4300B0;
            width: 19px;
            height: 19px;
            margin-left: 30px;
            margin-right: 11px;
          "
        >
          <span style="font-size: 14px;">Мужчины</span>
        </Checkbox>
        <Checkbox
          name="female"
          value="female"
          checked={female}
          disabled={isLoading}
          on:change={() => female = !female}
          title="select male"
          selectorStyle="
            border: 2px solid #4300B0;
            width: 19px;
            height: 19px;
            margin-left: 20px;
            margin-right: 11px;
          "
        >
          <span style="font-size: 14px;">Женщины</span>
        </Checkbox>
      </div>
      <Slider
        value={[18, 58]}
        min={18}
        max={58}
        step={1}
        tooltips="never"
        disabled={isLoading}
        ticks={{mode: 'values', values: [ 18, 23, 28, 33, 38, 43, 48, 53, 58]}}
        on:change={event => {
          valueStart = event.detail[0]
          valueEnd = event.detail[1]
        }}
      />
    </div>
    <div style="display: flex; flex-direction: row; align-items: center; margin-top: 58px;">
      <span style="display: block;">
        Выберите стилистику ответов
      </span>
      <Checkbox
        name="male"
        value="male"
        checked={emoParam1}
        disabled={isLoading}
        on:change={() => emoParam1 = !emoParam1}
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
        name="male"
        value="male"
        checked={emoParam2}
        disabled={isLoading}
        on:change={() => emoParam2 = !emoParam2}
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
        name="male"
        value="male"
        checked={emoParam3}
        disabled={isLoading}
        on:change={() => emoParam3 = !emoParam3}
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
        name="male"
        value="male"
        checked={emoParam4}
        disabled={isLoading}
        on:change={() => emoParam4 = !emoParam4}
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
          on:click={newQuestion}
          filled
          style="
            font-size: 15px;
            padding: 13px 22px 16px;
            margin-top: 44px;
          "
        >{ sendButton }</Button>
      { :else }
        <Button 
          filled
          style="
            font-size: 15px;
            padding: 13px 22px 16px;
            margin-top: 44px;
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
          margin-top: 44px;
          margin-left: 16px;
        "
      >Запасная кнопка на будущее</Button>
      { #if isLoading }
        <div 
          style="
            display: block; 
            margin-top: 42px; 
            margin-left: 40px;
            transform: scale(140%)
          "
        >    
          
          <Loading />
        
        </div>
      { /if }
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
    margin-bottom: 18px;
    font-size: 20px;
  } 
  .mainViewContentText {
    display: block;
    position: relative;
    box-sizing: border-box;
    width: 100%;
    height: 340px;
    border: none;
    outline: none;
    background-color: #FDFCF9;
    font-family: 'Roboto', sans-serif;
    border-radius: 26px;
    padding: 30px;
    padding-top: 24px;
    margin-top: 20px;
    line-height: 24px;
  }

</style>