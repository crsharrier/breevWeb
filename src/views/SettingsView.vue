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
            <BrvSlider v-model="settings.breaths" label="Breaths per round" :max="30" :min="20" />
        </v-col>
        <v-col cols="12">
            <BrvSlider v-model="settings.breathDuration" label="Breath duration (sec)" :max="4" :min="1" :step="0.5" />
        </v-col>
        <v-col cols="12">
            <BrvSlider v-model="settings.countdown" label="Countdown (sec)" :max="5" :min="1" />
        </v-col>
        <v-col cols="12">
            <BrvSlider v-model="settings.betweenRounds" label="Time between rounds (sec)" :max="10" :min="3" />
        </v-col>
    </v-row>
</template>