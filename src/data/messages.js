const messages = {
  startMessages: [
    { message: 'привет, меня зовут николай' },
    { message: 'я занимаюсь фронтенд разработкой на библиотеке react' },
    { message: 'основные направления - веб и мобильные приложения' },
    { message: 'последние разрабатываю с помощью react native + expo' },
    { message: 'суммарный опыт разработки в целом - около 5 лет' },
  ],
  otherMessagesOne: [
    { type: 'me', text: 'мой основной стек: react + react native, expo, firebase, mongo, svelte и php' },
    { type: 'me', text: 'если говорить про технологии, владею ES6 и выше, react 16-17-18, styled components. проекты собираю вебпаком, люблю ui библиотеки, могу собрать апи на nodejs + express' }
  ],
  otherMessagesTwo: [ 
    { type: 'me', text: 'сейчас расскажу, постараюсь без воды и лирики)' },
    { type: 'me', text: 'я работал штатным разработчиком в веб-студии айтекс, сделал там онлайн отчет' },
    { type: 'me', text: 'он собирал данные из яндекс директа и яндекс метрики и выдавал их в красивом виде с графиками и комментариями' },
    { type: 'me', text: 'можно было менять периоды, у каждого клиента была персональная ссылка' },
    { type: 'me', text: 'реализована внутренняя платформа для менеджеров, с интеграцией с битрикс24' },
    { type: 'me', text: 'мы собирали данные по звонкам, письмам, выполненным задачам, все данные отправлялись руководителю отдела, также в удобном и наглядном формате' },
    { type: 'me', text: 'а, кстати, возвращаясь к отчету метрики, был сделан телеграм бот, который также отдавал краткую сводку по кампаниям, в сжатом формате' },
    { type: 'me', text: 'еще была сделана система электронной коммерции, наподобие решения от яндекса, но более упрощенная, тк многим клиентам сложно ориентироваться в куче вкладок' },
    { type: 'me', text: 'про сервисы для клиентов, которые я сделал можно почитать тут, лендинг до сих живой. на всех сервисах делал и бек и фронт' },
    { type: 'me', text: 'http://cstr.tilda.ws/products' },
    { type: 'me', text: 'отдельно стоит отметить сервис для маркетологов' },
    { type: 'me', text: 'он позволял без помощи программистов ставить цели яндекс метрики на сайт' },
    { type: 'me', text: 'буквально в несколько кликов. формировался код который просто нужно вставить в сайт и цели готовы. это был самый цельный наш продукт' },
    { type: 'me', text: 'итогом стала презентация на форуме internet expo 2019' },
    { type: 'me', text: 'подробнее можно прочитать по ссылке ниже' },
    { type: 'me', text: 'http://cstr.tilda.ws' },
    { type: 'me', text: 'сейчас та версия, насколько я знаю, не функционирует, но я разрабатываю обновленный сервис, с большим набором функций' },
    { type: 'me', text: 'так, с айтексом вроде закончили' },
    { type: 'me', text: 'далее я работал как самозанятый, работал на свои проекты + сотрудничал за эти три года с двумя компаниями' },
    { type: 'me', text: 'deltaplan group и brandpol, за время работы участвовал в разработке внутренней полноценной crm системы, создал с нуля интерфейс сервиса для клиентов, полностью рабочая crud, готовый функционал, а также участвовал в командной разработке двух мобильных приложений, одно из которых по сути создавал сам с нуля. стек nativescript + react native + expo' },
  ],
  otherMessagesThree: [
    { type: 'me', text: 'сайты делаю. если говорить о предпочтениях, то это либо большие сложные проекты, наподобие интернет-магазинов или онлайн-школ, либо что компактное, лендинги, карточки, нравится даже тильда. собирать миллионный одинаковый сайт на вордпрессе очень не хочется, короче упор на что-то самописное)' },
  ],
  otherMessagesFour: [
    { type: 'me', text: 'стоимость разработки стандартного веб-приложения начинается от 60 тысяч рублей, конечная стоимость сильно зависит от типа проекта' },
    { type: 'me', text: 'в эту стоимость входит составление и согласование технического задания' },
    { type: 'me', text: 'если требуется, составление плана разработки, разбивка его на адекватные сроки, заведение проекта на таск-менеджере для простоты отслеживания моей работы и наконец сама разработка, разбитая на недельные спринты' },
    { type: 'me', text: 'в случае необходимости возможна работа по договору типа "договор с физлицом, имеющим налог на профессиональную деятельность". я не дизайнер, поэтому помочь разработать полноценный дизайн с нуля к сожалению не смогу' },
    { type: 'me', text: 'но сейчас есть много готовых решений с красивыми ux интерфейсами, во многих случаях достаточно использовать их' },
    { type: 'me', text: 'для остальных случаев у меня есть хороший дизайнер, обожающий креатив и готовый придумывать вам красивые кнопочки и рамочки ночами напролет' }
  ],
  otherMessagesFive: [
    { type: 'me', text: 'конечно, вот ссылка на мой профиль, копируйте' },
    { type: 'me', text: 'https://github.com/Nikname913' },
  ],
  otherMessagesSix: [
    { type: 'me', text: 'стоимость разработки мобильного приложения начинается от 20 тысяч' },
    { type: 'me', text: 'порядок работ и все организационные моменты такие же, как для веб-приложений, могу рассказать и про них тоже' },
    { type: 'me', text: 'разработка ведется на языке javascript, с использованием библиотек react native и expo. возможно, возмусь за разработку решения на no-code платформе, нужно смотреть' },
  ],
  otherMessagesSeven: [
    { type: 'me', text: 'интернет-магазин: цена стартует от 30 тысяч рублей' },
    { type: 'me', text: 'разработка лендинга: от 10 до 20 тысяч рублей' },
    { type: 'me', text: 'разработка лендинга на тильде 8 тысяч рублей' },
    { type: 'me', text: 'это примерные расценки, рекомендую написать мне и обсудить по тз' },
    { type: 'me', text: 'либо составить его и потом обсудить предметно' },
    { type: 'me', text: 'очень много факторов влияющих на сложность и стоимость, в общем' },
  ],
}

export default messages