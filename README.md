# sidecar-injector
## This is a mutating webhook to inject a google sql proxy sidecar for kubernetes
To reduce work required and possibility of failures this will automatically inject a sidecar with the sql proxy into your pods
In order for it to work you should be using workload identity with your gke clusters or you have to modify [webhook.js](src/webhook.js) to include the service account key file.
To mutate you need to add 2 things to your deployments.
- a label of `gcp-sql-proxy: enabled`
- an annotation of `sqlinstance: -instances=project:region:instance-name=tcp:port`  
the annotation is the connection string used in the sidecar for the command to connect.

## This has been tested on [kind](https://kind.sigs.k8s.io/docs/user/quick-start/) 
Kind is a tool for running local kubernetes clusters.
A [kind config file](kind.yaml) has been provided enabling the extra services required for webhooks. 
The cluster can be started with this command:  
`kind create cluster --config kind.yaml --image=kindest/node:v1.20.7`
## [Cert-Manager](https://cert-manager.io/docs/) 
Webhook admission controllers require certificates to validate.
To ease the management of certificate proliferation, cert-manager can be added per:  
`kubectl apply -f https://github.com/jetstack/cert-manager/releases/download/v1.5.3/cert-manager.yaml`
## Local deployment Process
- Build your image locally from [src](src/Dockerfile)
- Push your image to kind `kind load docker-image localimage:tag` 
- Deploy to kind cluster `kubectl apply -k kubernetes/base/`
- Deploy the included [test.yaml](kubernetes/base) `kubectl apply -f kubernetes/base/test.yaml`
Now check the logs from the mutating webhook server pod in the default namespace and you will see that it has been patched in the response.
