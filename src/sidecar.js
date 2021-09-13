const https = require('https');
const fs = require('fs');
const express = require('express');
const bodyParser = require('body-parser');

const hostname = '0.0.0.0';
const port = 8443;

//Webhook requires certificate with alt names
//Possibly change to use cert manager
const privateKey = fs.readFileSync('webhook.key').toString();
const certificate = fs.readFileSync('webhook.crt').toString();

const options = {key: privateKey, cert: certificate};

const app = express();
app.use(bodyParser.json());

app.post('/mutate', (req, res) => {
	console.log(req.body)
	console.log(req.body.request.object)
	let admissionResp = {
//Api Version and kind are required using V1
        apiVersion: "admission.k8s.io/v1",
        kind: "AdmissionReview", 
        response:{
//Return UID from request
          uid: (req.body.request.uid), 
          allowed: true,
          patchType: "JSONPatch",
//using file here to patch, response of patch needs to be base64
          patch: fs.readFileSync('sidecar.json').toString('base64'),
        }}
        console.log(admissionResp)
	res.send(admissionResp)
})

//Need to pass the certificates to server using options here
const server = https.createServer(options, app);

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});