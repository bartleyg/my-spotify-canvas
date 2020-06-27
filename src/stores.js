import { writable } from 'svelte/store';

export const playingSoundId = writable(null);
export const enableIndex = writable(0);
export const scrollPlayEnabled = writable(true);
