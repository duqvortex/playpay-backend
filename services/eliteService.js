async function getCashbackRate(user) {
  return user.elite ? 0.10 : 0.05;
}

module.exports = { getCashbackRate };