# INA219 電流センサー

## 配線図

![配線図](./schematic.png "schematic")

# ドライバのインストール

```
npm i @chirimen/ina219
```

# サンプルコード

```javascript
const { requestI2CAccess } = require("node-web-i2c");
const INA219 = require("@chirimen/ina219");
const { promisify } = require("util");
const sleep = promisify(setTimeout);

main();

async function main() {
  const i2cAccess = await requestI2CAccess();
  const port = i2cAccess.ports.get(1);
  const ina219 = new INA219(port, 0x40);
  await ina219.init();
  await ina219.configure();

  while (true) {
    const voltage = await ina219.voltage();
    const supplyVoltage = await ina219.supply_voltage();
    const current = await ina219.current();
    const power = await ina219.power();
    const shuntVoltage = await ina219.shunt_voltage();

    console.log(
      [
        `Voltage: ${voltage.toFixed(3)}V`,
        `Supply voltage: ${supplyVoltage.toFixed(3)}V`,
        `Current: ${current.toFixed(2)}mA`,
        `Power: ${power.toFixed(2)}mW`,
        `Shunt voltage: ${shuntVoltage.toFixed(2)}mV`
      ].join(", ")
    );

    await sleep(500);
  }
}
```

