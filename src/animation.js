"use strict"

export default function (name, duration, direction) {
  const anim = {
    animationName: `rjs-react-nav-animate-${name}`,
  };
  if (duration) { anim.animationDuration = duration; }
  if (direction) { anim.animationDirection = direction; }
  return anim;
}
