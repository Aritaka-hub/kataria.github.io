# BMP180 大気圧温度センサー

## 配線図

![配線図](./schematic.png "schematic")

# ドライバのインストール

```
npm i @chirimen/bmp180
```

# サンプルコード

```javascript
const { requestI2CAccess } = require("node-web-i2c");
const BMP180 = require("@chirimen/bmp180");
const { promisify } = require("util");
const sleep = promisify(setTimeout);

main();

async function main() {
  const readInterval = 1000;

  const i2cAccess = await requestI2CAccess();
  const port = i2cAccess.ports.get(1);
  const bmp180 = new BMP180(port, 0x77);
  await bmp180.init();
  for (;;) {
    const pressure = await bmp180.readPressure();
    const temperature = await bmp180.readTemperature();
    console.log(
      `Pressure: ${pressure.toFixed(2)} Pa, Temperature: ${temperature} degree.`
    );
    await sleep(readInterval);
  }
}
