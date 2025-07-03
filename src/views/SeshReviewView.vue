<script setup lang="ts">
import { storeToRefs } from 'pinia';
import useBreevSeshStore from '../stores/breevSeshstore';
import { computed } from 'vue';
const breevSeshStore = useBreevSeshStore()
const { history } = storeToRefs(breevSeshStore);

const latestSesh = history.value[0];
const completedAt = computed(() =>
    latestSesh.completedAt
        ? new Date(latestSesh.completedAt).toLocaleString()
        : ""
);
</script>

<template>
    <v-app-bar flat>
        <template #append>
            <v-btn icon="mdi-close" variant="text" size="x-large" :to="'/'" />
        </template>
    </v-app-bar>
    <v-row class="text-center">
        <v-col cols="12">
            <h1 class="text-3xl">Session Complete</h1>
            <p class="text-xl my-2">{{ completedAt }}</p>
            <div v-for="(round, index) in latestSesh.rounds" :key="index" class="my-2">
                <strong>Round {{ index + 1 }}:</strong>
                <span class="ml-3 mb-2">{{ (round.holdDurationMs / 1000).toFixed(2) }} sec</span>
            </div>
            <div v-if="latestSesh.rounds.length === 0" class="text-gray-500">
                No rounds completed.
            </div>
        </v-col>
    </v-row>
</template>