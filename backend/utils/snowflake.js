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

  toTimecode(id) {
    return parseInt(id) / 1000 + this.epoch;
  }

  toBase64(id) {
    return Buffer.from(id).toString('base64');
  }

  fromBase64(id) {
    return parseInt(Buffer.from(id, 'base64').toString('ascii'));
  }
}

const snowflake = new Snowflake();

module.exports = {
  generate: () => snowflake.generate(),
  toTimecode: (id) => snowflake.toTimecode(id),
  toBase64: (id) => snowflake.toBase64(id),
  fromBase64: (id) => snowflake.fromBase64(id)
};

