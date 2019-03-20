<template>
  <div id="loading">
    <div class="loading-cont">
      <span class="loading-text">LOADING...</span>

      <!-- <div class="dot1"></div>
      <div class="dot2"></div>
      <div class="dot3"></div>
      <div class="dot4"></div>
      <div class="dot5"></div>
      <div class="dot6"></div> -->
      <!-- <div class="dot"></div>
      <div class="dot"></div> -->
    </div>
  </div>
</template>

<script>
export default {
  
}
</script>

<style>
#loading{
  padding-top: 70%;
}
.loading-cont{
  position: relative;
  text-align: center;
}

.loading-text{
  font-size: 30px;
  font-weight: 900;
  letter-spacing:8px;
  animation: load 6s linear 0s infinite;
}
@keyframes load{
  0%{
    color:rgb(41, 41, 41);
    text-shadow: 0 0 19px #ddd;
  }
  50%{
    color:rgb(255, 255, 255);
    text-shadow: 0 0 19px #222;
  }
  100%{
    color:rgb(41, 41, 41);
    text-shadow: 0 0 19px #ddd;
  }
}
</style>
