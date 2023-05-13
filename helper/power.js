function additionalPower(baseExp) {
  if (baseExp < 44) {
    return Math.ceil(baseExp * 0.1);
  } else if (baseExp < 88) {
    return Math.ceil(baseExp * 0.2);
  } else if (baseExp < 132) {
    return Math.ceil(baseExp * 0.3);
  } else if (baseExp < 176) {
    return Math.ceil(baseExp * 0.4);
  } else if (baseExp < 220) {
    return Math.ceil(baseExp * 0.5);
  } else if (baseExp < 264) {
    return Math.ceil(baseExp * 0.6);
  } else if (baseExp < 308) {
    return Math.ceil(baseExp * 0.8);
  } else {
    return Math.ceil(baseExp * 0.9);
  }
}

module.exports = additionalPower;
