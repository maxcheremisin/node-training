import express from 'express';

const app = express();
const port = 3005;

app.get('*', (req, res) => res.json(req.url));

app.listen(port, () => {
    console.log(`Server is running on ${port}`);
});
