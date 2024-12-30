import { BLITZ, BULLET, CLASSICAL, RAPID } from "../settings/game";

export const filterGameTime = (time) => {
  if (time < 3) return BULLET;
  if (time <= 5) return BLITZ;
  if (time <= 15) return RAPID;
  return CLASSICAL;
};
