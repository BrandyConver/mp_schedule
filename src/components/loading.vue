<template>
  <div id="loading">
    <div class="loading-cont">
      <span class="loading-text">LOADING…</span>
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
  animation: load 4s linear 0s infinite;
}
@keyframes load{
  0%{
    color:rgba(255, 255, 255, 0);
    text-shadow: 0 0 19px rgba(255, 255, 255, 0);
  }
  50%{
    color:rgb(255, 255, 255);
    text-shadow: 0 0 19px #fff;
  }
  100%{
    color:rgba(255, 255, 255, 0);
    text-shadow: 0 0 19px rgba(255, 255, 255, 0);
  }
}
</style>
