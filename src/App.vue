<template>
  <div id="app">
    <app-header />
    <router-view/>
  </div>
</template>

<script>

import appHeader from '../src/cmps/app-header.cmp'

export default {
  name: 'app',
  components: {
    appHeader
  }
}
</script>
