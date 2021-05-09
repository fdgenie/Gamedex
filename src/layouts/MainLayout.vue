<template>
  <q-layout view="hHh lpR fFf">
    <q-header elevated>
      <q-toolbar>
        <q-toolbar-title>
          <q-btn class="text-h5" flat label="Gamedex" to="/" />
        </q-toolbar-title>

        <q-btn flat label="Home" class="q-mr-sm" to="/" />
        <q-btn flat label="Random" @click="goToRandomGame" />
      </q-toolbar>
    </q-header>

    <q-footer elevated class="bg-grey-10 text-white">
      <q-toolbar>
        <div>
          ® All rights reserved 2021
        </div>
        <q-space />
        <q-btn
          flat
          label="Sitemap"
           type="a"
          href="https://gamedex-assign.netlify.app/sitemap.xml"
           target="_blank"
        />
        <q-btn
          flat
          label="Api"
          type="a"
          href="https://rawg.io/apidocs"
          target="_blank"
        />
        <q-btn
          flat
          label="Github"
          type="a"
          href="https://github.com/fdgenie/Gamedex"
          target="_blank"
        />
      </q-toolbar>
    </q-footer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'MainLayout',
  methods: {
    goToRandomGame() {
      const gameId = Math.floor(Math.random() * 54912);
      return new Promise((resolve, reject) => {
        this.$router.push({ path: `/game/${gameId}` }, resolve, reject);
        if (this.$route.path !== '/') this.$router.go(0);
      });
    }
  }
});
</script>
