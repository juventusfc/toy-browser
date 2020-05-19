function match(str) {
  let state = start;
  for (let c of str) {
    state = state(c);
  }
  return state === end;
}

function start(char) {
  if (char === "a") {
    return matchA1;
  }
  return start;
}

function matchA1(char) {
  if (char === "b") {
    return matchB1;
  }
  return start(char);
}

function matchB1(char) {
  if (char === "a") {
    return matchA2;
  }
  return start(char);
}

function matchA2(char) {
  if (char === "b") {
    return matchB2;
  }
  return start(char);
}

function matchB2(char) {
  if (char === "a") {
    return matchA3;
  }
  return start(char);
}

function matchA3(char) {
  if (char === "b") {
    return matchB3;
  }
  return start(char);
}

function matchB3(char) {
  if (char === "x") {
    return end;
  }
  return matchB2(char);
}

function end(char) {
  return end;
}

const res = match("ababababx");

console.log(res);
