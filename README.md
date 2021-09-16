# This is a Sidecar Injector to Inject the sql proxy
## In order to run on Kind extra args need to be added which is provided in the kind.yaml
## The caBundle needs to be provided in the mutating webhook configuration
## sidecar.json can be modified to fit your needs
## add cert-manager to your kind cluster with 
´´´kubectl apply -f https://github.com/jetstack/cert-manager/releases/download/v1.5.3/cert-manager.yaml´´´
