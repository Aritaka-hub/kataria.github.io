# BME280 温度・湿度・気圧センサー

## 配線図

![配線図](./schematic.png "schematic")

# ドライバのインストール

```
npm i @chirimen/bme280
```

# サンプルコード

```javascript
const { requestI2CAccess } = require("node-web-i2c");
const BME280 = require("@chirimen/bme280");
const { promisify } = require("util");
const sleep = promisify(setTimeout);

main();

async function main() {
  const i2cAccess = await requestI2CAccess();
  const port = i2cAccess.ports.get(1);
  const bme280 = new BME280(port, 0x76);
  await bme280.init();

  while (true) {
    const data = await bme280.readData();
    const temperature = data.temperature.toFixed(2);
    const humidity = data.humidity.toFixed(2);
    const pressure = data.pressure.toFixed(2);
    console.log(
      [
        `Temperature: ${temperature} degree`,
        `Humidity: ${humidity} %`,
        `Pressure: ${pressure} hPa`
      ].join(", ")
    );
    await sleep(500);
  }
}
```

