<script>

  let src = "/image/ava.jpg"
  let telegram = "/image/telegram.png"

</script>

<section class:header={true}>
  <div class:headerContent={true}>
    <span class:headerLogo={true}>
      
      <img {src} alt={""}/>
    
    </span>
    <h1>nikdeveloper</h1>

    <div class:headerContacts={true}>
    
      <!-- svelte-ignore a11y-missing-content -->
      <a href="https://t.me/nikname913" target="_blank">nikname913</a>
      <img 
        src={telegram} 
        alt="telegram logo" 
        class:telegramIcon={true}
        on:click={() => window.open('https://t.me/nikname913')}
      />
    
    </div>
 
  </div>

</section>

<style>

  .header {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-around;
    box-sizing: border-box;
    width: 100%;
    height: 80px;
    background-color: #2F2233;
    box-shadow: 0px 0px 2.5px rgb(22, 22, 22);
    padding: 10px 14px;
  }
  .headerContent {
    position: relative;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    box-sizing: border-box;
    width: 800px;
    height: auto;
  }
  .headerContent h1 {
    display: block;
    height: auto;
    font-size: 20px;
    font-weight: 200;
    color: rgb(218, 218, 218);
    margin-left: 16px;
  }
  .headerLogo {
    display: block;
    position: relative;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    overflow: hidden;
  }
  .headerLogo img {
    display: block;
    position: relative;
    width: 100%;
    height: 100%;
    filter: grayscale(30%)
  }
  .headerContacts {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-end;
    position: absolute;
    width: 200px;
    height: auto;
    left: 100%;
    margin-left: -200px;
  }
  .headerContacts a {
    color: rgb(218, 218, 218);
    margin-right: 12px;
    font-weight: 200;
    font-size: 14px;
    letter-spacing: 1px;
    text-decoration: none;
  }
  .telegramIcon {
    display: block;
    position: relative;
    width: 40px;
    height: 40px;
  }

  @media screen and ( max-width: 500px ) {

    .headerContent { width: 100%; }
    .headerContacts a { display: none; }

  }

</style>