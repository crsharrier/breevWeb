<script setup lang="ts">
import { storeToRefs } from 'pinia';
import useBreevSeshStore from '../stores/breevSeshstore';
import BrvSlider from '../components/BrvSlider.vue';

const breevSeshStore = useBreevSeshStore();
const { settings } = storeToRefs(breevSeshStore);
</script>

<template>
    <v-row dense>
        <v-col cols="12">
            <BrvSlider v-model="settings.rounds" :label="settings.rounds > 1 ? 'rounds' : 'round'" :max="5" :min="1" />
        </v-col>
        <v-col cols="12">
            <BrvSlider v-model="settings.breaths" label="breaths per round" :max="30" :min="2" />
        </v-col>
        <v-col cols="12">
            <BrvSlider v-model="settings.breathDuration"
                :label="settings.breathDuration > 1 ? 'secs per breath' : 'sec per breath'" :max="4" :min="1"
                :step="0.5" />
        </v-col>
        <v-col cols="12">
            <BrvSlider v-model="settings.countdown" :label="settings.countdown > 1 ? 'secs countdown' : 'sec countdown'"
                :max="5" :min="1" />
        </v-col>
        <v-col cols="12">
            <BrvSlider v-model="settings.betweenRounds" label="secs between rounds" :max="10" :min="3" />
        </v-col>
    </v-row>
</template>