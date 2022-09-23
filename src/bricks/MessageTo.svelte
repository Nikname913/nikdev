<script>
  
  export let message

</script>
<div class:messageTo={true}>

  <p class:time={true}>{ message.split('::')[1] }</p>
  <p>{ message.split('::')[0] }</p>

</div>
<style>

  .messageTo {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-end;
    position: relative;
    box-sizing: border-box;
    width: 100%;
    height: auto;
    margin-top: 16px;
    margin-bottom: 16px;
  }
  .messageTo p {
    display: block;
    position: relative;
    box-sizing: border-box;
    background-color: #796AA4;
    margin: 0;
    color: rgb(15, 15, 15);
    border-top-right-radius: 4px;
    border-bottom-right-radius: 4px;
    border-top-left-radius: 10px;
    border-bottom-left-radius: 10px;
    padding: 8px;
    padding-bottom: 11px;
    padding-left: 10px;
    padding-right: 12px;
    padding-top: 7px;
    font-size: 14px;
  }
  .time {
    background-color: transparent !important;
    padding: 0 !important;
    font-size: 13px !important;
    color: #796AA4 !important;
    margin-right: 12px !important;
  }

  @media screen and ( max-width: 500px ) {

    .messageTo p { 
      display: block;
      position: relative;
      max-width: 66%; 
      font-size: 16px; 
      line-height: 20px; 
      padding-top: 8px;
      padding-left: 12px;
      color: rgb(204, 204, 204);
    }
    .time { 
      font-size: 13px;
      display: block;
      position: relative;
      width: 60px;
      text-align: right;
    }

  }

</style>