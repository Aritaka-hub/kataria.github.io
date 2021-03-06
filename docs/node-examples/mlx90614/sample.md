# MLX90614 赤外線温度センサー

## 配線図

![配線図](./schematic.png "schematic")

# ドライバのインストール

```
npm i @chirimen/mlx90614
```

# サンプルコード

```javascript
const { requestI2CAccess } = require("node-web-i2c");
const MLX90614 = require("@chirimen/mlx90614");
const { promisify } = require("util");
const sleep = promisify(setTimeout);

main();

async function main() {
  const i2cAccess = await requestI2CAccess();
  const port = i2cAccess.ports.get(1);
  const mlx90614 = new MLX90614(port, 0x5a);
  await mlx90614.init();

  while (true) {
    // Temperature of object that the sensor looking at. (Measured by IR sensor)
    const objectTemperature = await mlx90614.get_obj_temp();
    // Temperature measured by the chip. (The package temperature)
    const ambientTemperature = await mlx90614.get_amb_temp();
    console.log(
      [
        `Object temperature: ${objectTemperature.toFixed(2)} degree`,
        `Ambient temperature: ${ambientTemperature.toFixed(2)} degree`
      ].join(", ")
    );

    await sleep(500);
  }
}
```
