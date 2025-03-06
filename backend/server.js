require('dotenv').config()
const express = require('express');
const app = express();

app.use(express.json());
app.use('/', require('./routes/indexRouter'));
app.use('/dashboard', require('./routes/indexRouter'))

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
