# AMG8833 サーモグラフィー

## 配線図

![配線図](./schematic.png "schematic")

# ドライバのインストール

```
npm i @chirimen/amg8833
```

# サンプルコード

```javascript
const { requestI2CAccess } = require("node-web-i2c");
const AMG8833 = require("@chirimen/amg8833");
const { promisify } = require("util");
const sleep = promisify(setTimeout);

main();

async function main() {
  const i2cAccess = await requestI2CAccess();
  const port = i2cAccess.ports.get(1);
  const amg8833 = new AMG8833(port, 0x69);
  await amg8833.init();

  while (true) {
    const data = await amg8833.readData();
    for (const row of data) {
      // degree Celsius
      console.log(row.map(value => value.toFixed(2)).join(" "));
    }

    console.log();
    await sleep(500);
  }
}
```

