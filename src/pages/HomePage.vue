<template>
  <q-page class="q-pa-md">
    <div class="row q-px-xl q-py-md">
      <div class="text-h5 color-text text-primary">
        Home Page
      </div>
      <q-space />
      <div class=" row q-gutter-x-lg">
        <q-select
          v-model="sortOption"
          :options="['name', 'released', 'created', 'rating']"
          label="Sort By"
          @input="sortGames"
          class="filters-width"
          dense
          clearable
          bg-color="dark"
          dark
        />
        <q-input
          v-model="searchGame"
          debounce="3000"
          dense
          placeholder="Search..."
          color="primary"
          dark
          class="filters-width"
        >
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
      </div>
    </div>
    <div v-if="!loading && gamesCard.length > 0" class="card-container">
      <div v-for="game in gamesCard" :key="game.id">
        <GameCard :game="game" />
      </div>
    </div>
    <div v-else-if="gamesCard.length === 0 && !loading">
      <div class="flex justify-center text-h6 text-primary">
        Can't find any game. <br />
        Please search again.
      </div>
    </div>
    <div v-else>
      <div class="flex justify-center">
        <q-spinner-dots color="primary" size="40px" />
      </div>
    </div>
    <div class="q-pa-lg flex justify-center col">
      <q-pagination
        v-model="currentPage"
        :max="maxPages"
        input
        @click="changePage"
        color="primary"
        input-class="text-white"
      />
    </div>
  </q-page>
</template>

<script lang="ts">
import Vue from 'vue';
import GameCard from 'components/GameCard.vue';
import { GamesCardModel, GamesPagination } from 'src/models/models';

export default Vue.extend({
  name: 'HomePage',
  components: {
    GameCard
  },
  data() {
    const currentPage = 1;
    const sortOption: keyof GamesCardModel | string = '';
    const searchGame = '';
    return {
      currentPage,
      sortOption,
      searchGame
    };
  },
  computed: {
    gamePagination(): GamesPagination {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      return this.$store.getters['games/getGamePagination'] as GamesPagination;
    },
    gamesCard(): GamesCardModel[] {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      return this.$store.getters['games/getGamePagination']
        .results as GamesCardModel[];
    },
    loading(): boolean {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      return this.$store.getters['games/getLoading'] as boolean;
    },
    maxPages(): number {
      return Number((this.gamePagination.count / 10).toFixed(0));
    }
  },
  watch: {
    searchGame() {
      this.loadData();
    },
    $route() {
      this.$router.go(0);
    }
  },
  mounted() {
    this.loadData();
  },
  methods: {
    loadData(): void {
      void this.$store.dispatch('games/getGamesDispatch', {
        currentPage: this.currentPage,
        ordering: this.sortOption,
        search: this.searchGame,
        category: this.$route.query.category
      });
    },
    //Fetch the new date when change page
    changePage(): void {
      this.loadData();
    },
    //Fetch games sorted by option
    sortGames(): void {
      if (!this.sortOption) this.currentPage = 1;
      this.loadData();
    }
  }
});
</script>

<style scoped lang="scss">
.card-container {
  overflow: auto;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-evenly;
}

.filters-width {
  width: 250px;
}
</style>
