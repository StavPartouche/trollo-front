<template>
  <div id="app">
    <nav-bar/>
    <router-view/>
  </div>
</template>

<script>

import navBar from '../src/cmp/nav-bar.cmp'

export default {
  name: 'app',
  components: {
    navBar
  }
}
</script>
