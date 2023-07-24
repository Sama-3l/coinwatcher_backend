const app = require('./app');

const port = 3000;
app.get('/', (req, res) => {
    res.send('Hello World');
})

app.post('/post', (req, res) => {
    const data = req.body;
    console.log(data);
    res.send('WOrked')
});

app.listen(port, () => {
    console.log('Server listening on Port http://localhost:' + port);
});