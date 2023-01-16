require('dotenv').config();

const express = require('express');
const app = express();
const axios = require('axios');
const querystring = require('querystring');

const port = 8888;

const REDIRECT_URI = process.env.REDIRECT_URI;
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;

app.get('/login', (req, res) => {
	//res.send("Log into Spotify");
	res.redirect(`https://accounts.spotify.com/authorize?client_id=${CLIENT_ID}&response_type=code&redirect_uri=${REDIRECT_URI}`);

});

app.get('/callback',(req, res) => {
	const code = req.query.code || null;
	axios({
		method: 'post',
		url: 'https://accounts.spotify.com/api/token',
		data: querystring.stringify({
			grant_type:'authorization_code',
			code: code,
			redirect_uri: REDIRECT_URI
}),
	headers: {
	'content-type': 'application/x-www-form-urlencoded',
	Authorization: `Basic ${new Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64')}`,
		},
			})
			.then(response => {
				if (response.status === 200) {
				  res.send(`<pre>${JSON.stringify(response.data, null, 2)}</pre>`);
				} else {
				  res.send(response);
				}
			  })
			  .catch(error => {
				res.send(error);
			  });
});

app.listen(port, () => {
	console.log(`Live on ${port}`);
});
