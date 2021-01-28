import express from 'express';
import MlController from './app/controllers/MlController';
const app = express();


app.use(express.json());
app.post('/ml', MlController.store);


app.listen(3333, () => {
  console.log('server runing');
});
