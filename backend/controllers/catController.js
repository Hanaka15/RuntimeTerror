const sharp = require('sharp');
const path = require('path');

const imagePath = path.join(__dirname, '../public/cat.jpg');

const catController = async (req, res) => {
  try {
    const width = Number(req.params.width) || 300;
    const height = Number(req.params.height) || 400;
    const isGreyscale = req.params.greyscale === 'true';

    const outputBuffer = await sharp(imagePath)
      .resize(width, height, { fit: 'fill' })
      .greyscale(isGreyscale)
      .toFormat('jpeg')
      .toBuffer();

    res.set('Content-Type', 'image/jpeg');
    res.send(outputBuffer);
  } catch (err) {
    console.error('Error processing image:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = catController;
