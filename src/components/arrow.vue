<template>
  <div id="arrow">
    <div class="bottom"></div>
    <div class="top"></div>
  </div>
</template>
<style scoped>
#arrow{
  width: 15px;
  height: 25px;
  display: inline-block;
  position: relative;
  top: 3px;
}
.bottom{
  width: 0;
  height: 0;
  border: 10px solid transparent;
  border-left: 10px solid #666;
  position: absolute;
  top: 0;
  left: 2px;
}
.top{
  width: 0;
  height: 0;
  border: 10px solid transparent;
  border-left: 10px solid #fff;
  position: absolute;
  top: 0;
  left: 0;
}
</style>