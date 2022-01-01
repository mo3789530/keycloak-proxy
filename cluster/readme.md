## Run local  
```
python3 app.py
```

## Build   
```
docker  build -t mo053/keycloak-management .
docker push mo053/keycloak-management
```

## Deploy on k8s 
```
cd k8s
kubectl apply -f role -n <namespace>
kubectl apply -f deployment -n <namespace>
```