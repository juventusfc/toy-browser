# 有限状态机

- 每一个状态都是一个机器

  - 再每一个机器里，我们都可以计算、存储、输出。。。
  - 所有的这些机器接受的输入是一致的
  - 状态机的每一个机器本身没有状态，如果我们用函数来表示的话，它应该是纯函数

- 每一个机器知道下一个状态

  - 每个机器都有确定的下一个状态（Moore 类型）
  - 每个机器根据输入决定下一个状态（Mealy 类型）

## JavaScript 中的 Mealy 型状态机

状态机的一般套路：

```javascript
// 每个函数是一个状态
// 函数参数就是输入
function state(input) {
  // 在函数中，可以自由地编写代码，处理每个状态的逻辑
  // 返回值作为下一个状态
  return next;
}

// 调用
while (input) {
  // 把状态机的返回值作为下一个状态
  state = state(input);
}
```

状态机中经常使用的一种写法是: 返回某个状态函数的执行结果。分为两种情况：

- 一般情况下，还需要考虑初始状态的特殊情况。比如：

  ```javascript
  /**
   * 寻找 `ab`
   * 在这种情况下，需要警惕字符串中出现类似于 `aab` 的情况
   * 因为 `aab` 也是符合 `ab` 的
   * 为了防止第二个 a 被吞掉，需要使用 `start(char)` 执行一遍 start
   */
  function match(str) {
    let state = start;
    for (let c of str) {
      state = state(c);
    }
    return state === matchB;
  }

  function start(char) {
    if (char === "a") {
      return matchA;
    }
    return start;
  }

  function matchA(char) {
    if (char === "b") {
      return matchB;
    }
    // return start;
    return start(char); // !!!!
  }

  function matchB(char) {
    return matchB;
  }
  ```

- 还有需要考虑如 `abababx` 等**重叠问题**：

  ```javascript
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
    return matchB2(char); // !!!!
  }

  function end(char) {
    return end;
  }

  const res = match("ababababx");

  console.log(res);
  ```
