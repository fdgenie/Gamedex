<template>
  <q-card class="bg-grey-10 q-ma-md card" @click="goToDetails">
    <q-card-section>
      <div>
        <q-img :src="game.background_image" spinner-color="white" class="img">
          <template v-slot:error>
            <div class="absolute-full flex flex-center bg-grey-8 text-white">
              Cannot load image
            </div>
          </template>
        </q-img>
      </div>
      <div class="row items-center q-mt-md">
        <div class="col text-body1">{{ game.name }}</div>
        <div
          class="col-auto text-body2 q-pa-sm metacritic roboto-mono-font"
          :class="ratingColor(game.metacritic)"
        >
          {{ game.metacritic ? game.metacritic : '??' }}
        </div>
      </div>
    </q-card-section>
  </q-card>
</template>

<script lang="ts">
import { GamesCardModel } from 'src/models/models';
import Vue, { PropType } from 'vue';

export default Vue.extend({
  name: 'GameCard',
  props: {
    game: {
      type: (Object as unknown) as PropType<GamesCardModel>,
      required: true
    }
  },
  methods: {
    //change the color of the metacritic depending on the rating
    ratingColor(metacritic: number): string {
      if (metacritic > 60) {
        return 'text-green';
      } else if (metacritic > 30) {
        return 'text-yellow';
      }

      return 'text-red';
    },
    //get you to the details of a game
    goToDetails() {
      void this.$router.push({ path: `/game/${this.game.id}` });
      if (this.$route.path !== '/') this.$router.go(0);
    }
  }
});
</script>

<style scoped lang="scss">
.card {
  color: white;
  width: 300px;
  cursor: pointer;
}
.img {
  height: 200px;
}
</style>
