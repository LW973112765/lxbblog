<template>
  <div>
    <div class="fengche">
      <img
        src="https://infinityicon.infinitynewtab.com/assets/windmill.svg"
        alt=""
      />
      <span></span>
    </div>
  </div>
</template>

<script>
export default {};
</script>

<style lang="less" scoped>
.fengche span {
  display: block;
  margin-top: -30px;
  margin-left: auto;
  margin-right: auto;
  width: 5px;
  height: 56px;
  background-color: rgb(254, 254, 254);
}
.fengche img {
  z-index: 1;
  // cursor: pointer;
  width: 40px;
  height: 40px;
  animation: zxl 4s linear infinite reverse;
}
@keyframes zxl {
  0% {
    transform: rotate(0);
  }
  100% {
    transform: rotate(360deg);
  }
}
.feng {
  position: absolute;
  right: 20px;
  bottom: 0px;
  display: flex;
  flex-direction: column;
}
</style>