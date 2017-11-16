#cd directorio donde esta el build.gradle
gradle build
docker build -t gcr.io/microservicesgg/transacciones:v1 .
gcloud docker -- push gcr.io/microservicesgg/transacciones:v1
gcloud container clusters create transacciones-cluster \
  --num-nodes 2 \
  --machine-type n1-standard-1 \
  --zone us-central1-c
kubectl run transacciones \
  --image=gcr.io/microservicesgg/transacciones:v1 \
  --port=8080
kubectl expose deployment transacciones --type=LoadBalancer
