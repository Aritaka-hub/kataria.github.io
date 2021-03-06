# TCS34725 カラーセンサー

## 配線図

![配線図](./schematic.png "schematic")

# ドライバのインストール

```
npm i @chirimen/tcs34725
```

# サンプルコード

```javascript
const { requestI2CAccess } = require("node-web-i2c");
const TCS34725 = require("@chirimen/tcs34725");
const { promisify } = require("util");
const sleep = promisify(setTimeout);

main();

async function main() {
  const i2cAccess = await requestI2CAccess();
  const port = i2cAccess.ports.get(1);
  const tcs34725 = new TCS34725(port, 0x29);
  await tcs34725.init();

  // You can select the value of gain from 1, 4, 16 or 60.
  await tcs34725.gain(4);

  while (true) {
    const data = await tcs34725.read();
    console.log(
      [
        `R: ${data.r}`,
        `G: ${data.g}`,
        `B: ${data.b}`,
        `Clear Light: ${data.c}`
      ].join(", ")
    );

    await sleep(500);
  }
}
```

