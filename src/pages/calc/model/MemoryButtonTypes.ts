export const MemoryButtonTypes = {
  enabled: "enabled",
  disabled: "disabled",
} as const;

export type MemoryButtonTypes = typeof MemoryButtonTypes[keyof typeof MemoryButtonTypes];
