# Neopixel LED

## 配線図

![配線図](./schematic.png "schematic")

## 配線図（専用ボード使用）

![配線図](./schematic_with_dedicated_breadboard.png "schematic")

# ドライバのインストール

```
npm i @chirimen/neopixel-i2c
```

# サンプルコード

```javascript
const { requestI2CAccess } = require("node-web-i2c");
const Neopixel = require("@chirimen/neopixel-i2c");
const { promisify } = require("util");
const sleep = promisify(setTimeout);

main();

async function main() {
  const i2cAccess = await requestI2CAccess();
  const port = i2cAccess.ports.get(1);
  const neopixel = new Neopixel(port, 0x41);
  await neopixel.init();

  while (true) {
    await neopixel.setGlobal(64, 0, 0); // Red
    await sleep(200);
    await neopixel.setGlobal(0, 64, 0); // Green
    await sleep(200);
    await neopixel.setGlobal(0, 0, 64); // Blue
    await sleep(200);
  }
}
```

