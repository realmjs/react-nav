"use strict"

export default function (name, duration, direction) {
  const anim = {
    animationName: `animate-${name}`,
  };
  if (duration) { anim.animationDuration = duration; }
  if (direction) { anim.animationDirection = direction; }
  return anim;
}
