function match(str) {
  let foundA = false;
  for (let c of str) {
    if (c === "a") {
      foundA = true;
    } else if (foundA && c === "b") {
      return true;
    } else {
      foundA = false;
    }
  }
  return false;
}

const res = match("I am groabot");

console.log(res);
