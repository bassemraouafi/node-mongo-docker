const express = require('express');
const mongoose = require('mongoose');

const app = express();
const port = 3000;

const userSchema = new mongoose.Schema({
    name: String,
    email: String
});

const User = mongoose.model('User', userSchema);

mongoose.connect(process.env.MONGO_URI || 'mongodb://mongo:27017/test', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('Connected to MongoDB');

        const users = [
            { name: 'John Doe', email: 'john@example.com' },
            { name: 'Jane Doe', email: 'jane@example.com' },
            { name: 'Jim Beam', email: 'jim@example.com' },
            { name: 'Jack Daniels', email: 'jack@example.com' },
            { name: 'Jose Cuervo', email: 'jose@example.com' }
        ];

        User.countDocuments()
            .then(count => {
                if (count === 0) {
                    return User.insertMany(users);
                } else {
                    console.log('Users already exist in the database');
                    return Promise.resolve();
                }
            })
            .then(() => console.log('Users added'))
            .catch(err => console.error('Error inserting users:', err));
    })
    .catch(err => console.error('Error connecting to MongoDB:', err));

app.get('/', (req, res) => {
    User.find()
        .then(users => res.json(users))
        .catch(err => {
            console.error('Error fetching users:', err);
            res.status(500).send(err);
        });
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
