export const EDUCATIONAL_COPY = Object.freeze({
  educationalDisclaimer:
    "Educational explanation only. Calculator outputs are estimates based on the inputs and assumptions shown.",
  unsupportedDomain:
    "This explanation is not available for this calculator yet. You can review the calculator inputs and result labels for an educational overview.",
});

export function getEducationalDisclaimer() {
  return EDUCATIONAL_COPY.educationalDisclaimer;
}
