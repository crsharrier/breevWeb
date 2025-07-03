<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import Chart from 'chart.js/auto';
import type { ChartConfiguration } from 'chart.js';
import { storeToRefs } from 'pinia';
import useBreevSeshStore from '../stores/breevSeshstore';
import 'chartjs-adapter-date-fns';

const breevSeshStore = useBreevSeshStore();
const { history } = storeToRefs(breevSeshStore);
const historyChartRef = ref<HTMLCanvasElement | null>(null);

const selectedRange = ref<'7d' | '1m' | '6m' | 'all'>('1m');
let chartInstance: Chart | null | undefined = null;

const filterHistoryByRange = () => {
    const now = new Date();
    let cutoff: Date | null = null;

    switch (selectedRange.value) {
        case '7d':
            cutoff = new Date(now.setDate(now.getDate() - 7));
            break;
        case '1m':
            cutoff = new Date(now.setMonth(now.getMonth() - 1));
            break;
        case '6m':
            cutoff = new Date(now.setMonth(now.getMonth() - 6));
            break;
        case 'all':
            cutoff = null;
            break;
    }
    return cutoff
        ? history.value.filter(record => record.completedAt && new Date(record.completedAt) >= cutoff)
        : history.value;
}

import { computed } from 'vue';

const numDaysInRange = computed(() => {
    if (!history.value.length) return 0;
    const oldest = history.value
        .map(r => r.completedAt)
        .filter(date => date !== null && date !== undefined)
        .map(date => new Date(date))
        .sort((a, b) => a.getTime() - b.getTime())[0];
    if (!oldest) return 0;
    const now = new Date();
    const diffMs = now.getTime() - oldest.getTime();
    return Math.floor(diffMs / (1000 * 60 * 60 * 24));
});

const renderChart = () => {
    const filtered = filterHistoryByRange();
    const now = new Date();
    let cutoff: Date;
    let timeUnit: 'day' | 'week' | 'month' = 'day';

    switch (selectedRange.value) {
        case '7d':
            cutoff = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            timeUnit = 'day';
            break;
        case '1m':
            cutoff = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
            timeUnit = 'day';
            break;
        case '6m':
            cutoff = new Date(now.getFullYear(), now.getMonth() - 6, now.getDate());
            timeUnit = 'week';
            break;
        case 'all':
            cutoff = filtered.length
                ? new Date(Math.min(...filtered.map(r => r.completedAt ? new Date(r.completedAt).getTime() : 0)))
                : new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
            timeUnit = 'month';
            break;
    }

    const filteredData = filtered
        .filter(record => record.completedAt && !isNaN(new Date(record.completedAt).getTime()) && typeof record.avgHoldDurationMs === 'number')
        .map(record => ({
            x: record.completedAt ? new Date(record.completedAt).getTime() : 0,
            y: record.avgHoldDurationMs as number,
        }));

    const data = {
        labels: filteredData.map(point => point.x),
        datasets: [
            {
                label: 'Avg. hold duration',
                data: filteredData,
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
            },
        ],
    }
    const config: ChartConfiguration<'line', { x: number; y: number; }[], number> = {
        type: 'line',
        data: data,
        options: {
            maintainAspectRatio: false,
            layout: {
                padding: {
                    bottom: 50,
                },
            },
            scales: {
                x: {
                    type: 'time',
                    time: {
                        unit: timeUnit, // or 'week' if you want more spacing
                        displayFormats: {
                            day: 'MMM d',
                            week: 'MMM d',
                            month: 'MMM yyyy',
                        },
                    },
                    ticks: {
                        autoSkip: true,
                        maxTicksLimit: 4,
                    },
                    min: cutoff ? cutoff.getTime() : undefined,
                    max: now.getTime(),
                },
                y: {
                    stacked: true,
                    ticks: {
                        callback: function (value) {
                            return (Number(value) / 1000).toFixed(1) + 's';
                        },
                    },
                }
            },
            plugins: {
                filler: {
                    propagate: false
                },
                legend: {
                    onClick: () => { } // Disable legend click
                },
                tooltip: {
                    callbacks: {
                        label: context => {
                            const raw = context.raw as { x: string | undefined; y: number | undefined };
                            return `${context.dataset.label}: ${(raw.y ? raw.y / 1000 : 0).toFixed(1)}s`;
                        },
                    },
                },
            },
            interaction: {
                intersect: false,
            },
        }
    };

    if (chartInstance) {
        chartInstance.destroy();
    }

    if (historyChartRef.value) {
        chartInstance = new Chart(historyChartRef.value, config);
    }
};

onMounted(() => {
    renderChart();
})
watch(selectedRange, () => {
    renderChart();
});
</script>

<template>
    <div class="w-full max-w-3xl h-[400px] mx-auto"> <!-- Set desired height -->
        <v-btn-toggle v-model="selectedRange" mandatory class="flex justify-center gap-1 w-full my-2"
            density="comfortable" variant="outlined" color="primary">
            <v-btn size="x-small" density="compact" value="7d">7 Days</v-btn>
            <v-btn v-if="numDaysInRange > 7" size="x-small" density="compact" value="1m">1 Month</v-btn>
            <v-btn v-if="numDaysInRange > 30" size="x-small" density="compact" value="6m">6 Months</v-btn>
            <v-btn v-if="numDaysInRange > 360" size="x-small" density="compact" value="all">All Time</v-btn>
        </v-btn-toggle>
        <canvas ref="historyChartRef"></canvas>
    </div>

</template>
