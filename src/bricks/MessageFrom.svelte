<script>
  
  export let message

</script>
<div class:messageFrom={true}>
  
  <p>{ @html message.split('::')[0] }</p>

  { #if message.split('::')[1] }
  
    <p class:time={true}>{ message.split('::')[1] }</p>
  
  { /if }

</div>
<style>

  .messageFrom {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    position: relative;
    box-sizing: border-box;
    width: 100%;
    height: auto;
    margin-bottom: 8px;
  }
  .messageFrom p {
    display: block;
    position: relative;
    box-sizing: border-box;
    background-color: #5B4081;
    margin: 0;
    color: rgb(15, 15, 15);
    border-top-right-radius: 10px;
    border-bottom-right-radius: 10px;
    border-top-left-radius: 4px;
    border-bottom-left-radius: 4px;
    padding: 8px;
    padding-bottom: 11px;
    padding-left: 10px;
    padding-right: 12px;
    padding-top: 7px;
    font-size: 14px;
    overflow: hidden;
  }
  .time {
    background-color: transparent !important;
    padding: 0 !important;
    font-size: 13px !important;
    color: #796AA4 !important;
    margin-left: 12px !important;
    width: 130px;
  }

  @media screen and ( max-width: 500px ) {

    .messageFrom p { 
      max-width: 80%; 
      font-size: 16px; 
      line-height: 20px;
      padding-top: 8px; 
      padding-right: 14px !important;
      padding-left: 12px;
      color: rgb(204, 204, 204);
    }
    .time {
      display: block;
      position: relative;
      background-color: transparent !important;
      padding: 0 !important;
      font-size: 13px !important;
      color: #796AA4 !important;
      margin-left: 12px !important;
      width: 80px;
    }

  }

</style>