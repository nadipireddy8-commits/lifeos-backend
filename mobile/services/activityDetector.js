import { Pedometer } from 'expo-sensors';
import { logAction } from './api';

let lastStepCount = 0;
let interval;

export async function startAutoActivityDetection() {
  const isAvailable = await Pedometer.isAvailableAsync();
  if (!isAvailable) return;

  Pedometer.watchStepCount(result => {
    const steps = result.steps;
    const stepDiff = steps - lastStepCount;
    if (stepDiff > 50) {
      lastStepCount = steps;
      logAction({
        actionText: `Walked ${stepDiff} steps`,
        category: 'physical',
        source: 'auto_sensor',
        metadata: { steps: stepDiff }
      }).catch(console.error);
    }
  });

  // Optional: log every 30 minutes a summary
  interval = setInterval(async () => {
    if (lastStepCount > 0) {
      await logAction({
        actionText: `Daily activity: ${lastStepCount} steps so far`,
        category: 'physical',
        source: 'auto_sensor'
      });
    }
  }, 30 * 60 * 1000);
}