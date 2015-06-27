import express from 'express';
import routes from './lib/routes';

let app = express();

app.use(express.static(__dirname + '/public'));
app.use(routes());

let port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
