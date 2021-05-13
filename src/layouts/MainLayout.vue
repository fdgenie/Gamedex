<template>
  <q-layout view="hHh lpR fFf">
    <!-- Header -->
    <q-header elevated>
      <q-toolbar>
        <q-toolbar-title>
          <q-btn class="text-h5" flat label="Gamedex" to="/" />
        </q-toolbar-title>

        <div class="gt-sm">
          <q-btn flat label="Home" class="q-mr-sm" to="/" />
          <q-btn flat label="Categories">
            <q-menu dark >
              <q-list style="min-width: 100px">
                <q-item
                  clickable
                  v-close-popup
                  v-for="genre in genres"
                  :key="genre.id"
                  :to="'/?category=' + genre.slug"
                >
                  <q-item-section>{{ genre.name }}</q-item-section>
                </q-item>
              </q-list>
            </q-menu>
          </q-btn>
          <q-btn flat label="Random" @click="goToRandomGame" />
        </div>

        <!-- Drawer  -->
        <q-btn
          class="lt-md"
          flat
          dense
          round
          @click="drawerOpen = !drawerOpen"
          icon="mdi-menu"
          aria-label="Drawer Menu"
        />
        <q-drawer
          class="lt-md"
          v-model="drawerOpen"
          side="right"
          bordered
          :width="150"
          dark
        >
          <div class="column justify-center q-mt-md">
            <q-btn flat label="Home" class="q-mr-sm" to="/" />
            <q-btn flat label="Categories">
              <q-menu dark>
                <q-list style="min-width: 100px">
                  <q-item
                    clickable
                    v-close-popup
                    v-for="genre in genres"
                    :key="genre.id"
                    :to="'/?category=' + genre.slug"
                  >
                    <q-item-section>{{ genre.name }}</q-item-section>
                  </q-item>
                </q-list>
              </q-menu>
            </q-btn>
            <q-btn flat label="Random" @click="goToRandomGame" />
          </div>
        </q-drawer>
      </q-toolbar>
    </q-header>

    <!-- Footer -->
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
import { GenresModel } from 'src/models/models';
import Vue from 'vue';

export default Vue.extend({
  name: 'MainLayout',
  data() {
    const drawerOpen = false;
    return { drawerOpen };
  },
  computed: {
    genres(): GenresModel[] {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      return this.$store.getters['genres/getGenrePagination']
        .results as GenresModel[];
    }
  },
  mounted() {
    //Get the genres of the games for categories menu
    void this.$store.dispatch('genres/getGenresDispatch');
  },
  methods: {
    //Go to a details page in a random game
    goToRandomGame() {
      const gameId = Math.floor(Math.random() * 54912);

      void this.$router.push({ path: `/game/${gameId}?random` });
      if (this.$route.path !== '/') this.$router.go(0);
    }
  }
});
</script>
