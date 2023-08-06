export * from "./math";
export * from "./make-request";

export const getTargetMuscles = (target) => {
  return target?.Primary?.map((muscle) => muscle).join(", ");
};
