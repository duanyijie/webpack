<template>
  <div class="text-center">
    <h2>hello hiram</h2>
    <div>\{{ currentDate }}</div>
  </div>
</template>

<script>
import {parseTime} from '~utils'
export default {
  data () {
    return {
      date : new Date()
    }
  },
  computed :{
    currentDate () {
      return parseTime(this.date)
    }
  },
  methods: {
    refreshTime () {
      this.date = new Date()
    }
  },
  created () {
    setInterval(() => {
      this.refreshTime()
    },1000)
  }
}
</script>
