<script setup lang="ts">
import { storeToRefs } from 'pinia';
import useBreevSeshStore from '../stores/breevSeshstore';
import { ref } from 'vue';
// import LineChart from '@/components/ui/chart-line/LineChart.vue';

const breevSeshStore = useBreevSeshStore();
const { history } = storeToRefs(breevSeshStore);

type HistoryTab = 'list' | 'graph'
const tab = ref<HistoryTab>('list');

</script>

<template>
    <v-card height="500" width="500" class="overflow-y-auto">
        <v-tabs v-model="tab" color="primary">
            <v-tab value="list">
                <v-icon icon="mdi-format-list-bulleted" />
            </v-tab>
            <v-tab value="graph">
                <v-icon icon="mdi-chart-line" />
            </v-tab>
        </v-tabs>

        <v-tabs-window v-model="tab">
            <v-tabs-window-item value="list">
                <div v-if="!history.length" class="w-full h-full">
                    <div class="text-center text-gray-500 py-8">
                        No history available. Start a session to see your progress here.
                    </div>
                </div>
                <v-expansion-panels v-else>
                    <v-expansion-panel v-for="(record, index) in history" :key="index">

                        <v-expansion-panel-title>
                            <strong class="w-28 text-right">
                                {{ new Date(record.completedAt).toLocaleDateString('en-GB', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                }) }}
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
                <div>Graph View coming soon</div>
                <!-- <LineChart :data="data" index="year" :categories="['Export Growth Rate', 'Import Growth Rate']"
                    :y-formatter="(tick, i) => {
                        return typeof tick === 'number'
                            ? `$ ${new Intl.NumberFormat('us').format(tick).toString()}`
                            : ''
                    }" /> -->
            </v-tabs-window-item>
        </v-tabs-window>
    </v-card>
</template>