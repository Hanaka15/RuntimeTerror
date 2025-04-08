require('dotenv').config();

class Snowflake {
  constructor() {
    this.machineId = parseInt(process.env.MACHINE_ID, 10);
    this.epoch = parseInt(process.env.EPOCH, 10);
    this.sequence = 0;
    this.lastTimestamp = -1;
    this.sequenceMask = 4095;
    this.machineIdShift = 12;
    this.timestampShift = 22;
  }

  generate() {
    let timestamp = Date.now();

    if (timestamp === this.lastTimestamp) {
      this.sequence = (this.sequence + 1) & this.sequenceMask;
      if (this.sequence === 0) {
        while ((timestamp = Date.now()) <= this.lastTimestamp);
      }
    } else {
      this.sequence = 0;
    }

    this.lastTimestamp = timestamp;

    return (
      (BigInt(timestamp - this.epoch) << BigInt(this.timestampShift)) |
      (BigInt(this.machineId) << BigInt(this.machineIdShift)) |
      BigInt(this.sequence)
    ).toString();
  }
}

// 🔥 Shared instance here
const snowflakeInstance = new Snowflake();

module.exports = {
  generate: () => snowflakeInstance.generate()
};