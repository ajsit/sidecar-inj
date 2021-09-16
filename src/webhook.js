var https = require('https');
var fs = require('fs');
var express = require('express');
var bodyParser = require('body-parser');

var hostname = '0.0.0.0';
var port = 8443;

//Webhook requires certificate with alt names
//Possibly change to use cert manager
var httpsOptions = {
   key: fs.readFileSync('/certs/tls.key'),
   cert: fs.readFileSync('/certs/tls.crt')
}
//var options = {key: privateKey, cert: certificate};

var app = express();
app.use(bodyParser.json());

app.post('/mutate', (req, res) => {
	//var arrayContainer = req.body.request.object.spec.containers
    //var arrayEnvfrom = arrayContainer[0].envFrom
    //var arrayconfigMapRef = arrayEnvfrom[0].configMapRef
    //var instance =  req.body.request.object.metadata.annotations
    //Key used to declare the connection in annotations
    var sqlinstance = "sqlinstance"
    //Pulls the value from the key
    var sqlinstancestring = req.body.request.object.metadata.annotations[sqlinstance]
    console.log(req.body)
    //console.log(Object.values(req.body.request.object.metadata.annotations))
    //console.log(req.body[sqlinstance])
	//console.log(req.body.request.object)
    //console.log((JSON.stringify(req.body, null, 4)))
    //console.log(req.body.request.object.spec.containers)
	let admissionResp = {
//Api Version and kind are required using V1
        apiVersion: "admission.k8s.io/v1",
        kind: "AdmissionReview", 
        response:{
//Return UID from request
          uid: (req.body.request.uid),
          sqlstring: sqlinstancestring,
          allowed: true,
          patchType: "JSONPatch",
          patch: Buffer.from("[{\"op\":\"add\",\"path\":\"\\\/spec\\\/containers\\\/-\",\"value\":{\"name\":\"sql-proxy-sidecar\",\"image\":\"gcr.io\\\/cloudsql-docker\\\/gce-proxy:1.17\",\"command\":[\"\\\/cloud_sql_proxy\", \""+sqlinstancestring+"\"],\"securityContext\":{\"runAsNonRoot\":true}}}]").toString('base64'),
        }}
        console.log(admissionResp)
	    res.send(admissionResp)
})

//Need to pass the certificates to server using options here
var server = https.createServer(httpsOptions, app);

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});