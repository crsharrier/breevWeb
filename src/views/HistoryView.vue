<script setup lang="ts">
import { storeToRefs } from 'pinia';
import useBreevSeshStore from '../stores/breevSeshstore';
import HistoryChart from '@/components/HistoryChart.vue';

const breevSeshStore = useBreevSeshStore();
const { history, historyTab } = storeToRefs(breevSeshStore);



</script>

<template>
    <v-row dense class="w-100 max-w-[500px] justify-center">
        <v-col cols="12" class="d-flex justify-center">
            <v-card height="500" class="overflow-y-auto pa-2" style="max-width: 600px; width: 100%;">
                <v-tabs v-model="historyTab" color="primary">
                    <v-tab value="list">
                        <v-icon icon="mdi-format-list-bulleted" />
                    </v-tab>
                    <v-tab value="graph">
                        <v-icon icon="mdi-chart-line" />
                    </v-tab>
                </v-tabs>

                <v-tabs-window v-model="historyTab">
                    <v-tabs-window-item value="list">
                        <div v-if="!history.length" class="w-full h-full">
                            <div class="text-center text-gray-500 py-8">
                                No history available. Complete a session to see it listed here.
                            </div>
                        </div>
                        <v-expansion-panels v-else>
                            <v-expansion-panel v-for="(record, index) in history" :key="index">

                                <v-expansion-panel-title>
                                    <strong class="w-28 text-right">
                                        {{ record.completedAt ? new Date(record.completedAt).toLocaleDateString('en-GB',
                                            {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric',
                                            }) : 'Unknown Date' }}
                                    </strong>
                                    <div class="ml-3">
                                        {{ record.avgHoldDurationMs
                                            ? `${(record.avgHoldDurationMs / 1000).toFixed(2)} sec`
                                            : '' }}
                                    </div>
                                </v-expansion-panel-title>
                                <v-expansion-panel-text>
                                    <div class="text-sm px-8">
                                        Breaths per round: {{ record.breathsPerRound }}
                                        <div v-for="(round, i) in record.rounds" class="ml-4 my-1">
                                            <div>
                                                Round {{ i + 1 }}: <span class="text-base"> {{ (round.holdDurationMs /
                                                    1000).toFixed(2) }} sec </span>
                                            </div>
                                        </div>
                                    </div>
                                </v-expansion-panel-text>

                            </v-expansion-panel>
                        </v-expansion-panels>
                    </v-tabs-window-item>

                    <v-tabs-window-item value="graph">
                        <!-- <div>Graph View coming soon</div> -->
                        <div v-if="history" class="text-center text-gray-500 py-8">
                            No history available. Complete a session to see it visualised here.
                        </div>
                        <HistoryChart v-else />
                    </v-tabs-window-item>
                </v-tabs-window>
            </v-card>
        </v-col>
    </v-row>
</template>