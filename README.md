# Cloud-Native REST API Service

A simple REST API service demonstrating cloud-native application development, containerisation, and Kubernetes orchestration.

**Course:** SIT323/SIT737 Cloud Native Application Development  
**Project:** Individual Capstone Project (Stage 1)  
**Student:** [Your Name]  
**Student ID:** [Your ID]

---

## 📋 Overview

This project implements a lightweight REST API service built with Node.js and Express, containerised with Docker, and deployed to Google Kubernetes Engine (GKE) with automated CI/CD using Cloud Build.

### Key Features

- ✅ **RESTful API** – CRUD operations for item management
- ✅ **Containerised** – Docker multi-stage build for optimised images
- ✅ **Kubernetes Ready** – Deployment manifests with health checks and resource limits
- ✅ **CI/CD Automated** – Cloud Build pipeline for build, push, and deploy
- ✅ **Cloud Native** – Non-root users, security contexts, liveness/readiness probes
- ✅ **Load Balanced** – Kubernetes Service distributes traffic across pod replicas

---

## 🚀 Quick Start

### Prerequisites

- Docker installed locally
- Node.js 18+ (for local development)
- `kubectl` configured for GKE cluster access
- GCP project with Cloud Build and GKE enabled

### Build & Run Locally

```bash
# Install dependencies
npm install

# Run API server
npm start
# Server runs on http://localhost:3000

# Test health endpoint
curl http://localhost:3000/health
```

### Build Docker Image

```bash
# Build the image
docker build -t rest-api-service:v1.0 .

# Run container locally
docker run -p 3000:3000 rest-api-service:v1.0

# Test from another terminal
curl http://localhost:3000/api/items
```

---

## 📦 Project Structure

```
.
├── app.js                           # Express application (main entry point)
├── package.json                     # Node.js dependencies
├── Dockerfile                       # Container image definition
├── kubernetes-deployment.yaml       # GKE deployment & service
├── cloudbuild.yaml                  # CI/CD pipeline configuration
├── .gitignore                       # Git ignore rules
└── README.md                        # This file
```

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/health` | Health check (Kubernetes probes) |
| `GET` | `/api/items` | Get all items |
| `GET` | `/api/items/:id` | Get item by ID |
| `POST` | `/api/items` | Create new item |
| `DELETE` | `/api/items/:id` | Delete item by ID |

### Example Usage

```bash
# Get all items
curl http://localhost:3000/api/items

# Create an item
curl -X POST http://localhost:3000/api/items \
  -H "Content-Type: application/json" \
  -d '{"name":"My Item","description":"A sample item"}'

# Get specific item
curl http://localhost:3000/api/items/1

# Delete item
curl -X DELETE http://localhost:3000/api/items/1
```

---

## 🐳 Docker & Container Registry

### Push to Container Registry

```bash
# Set your GCP project ID
export PROJECT_ID=your-gcp-project-id

# Tag image
docker tag rest-api-service:v1.0 gcr.io/$PROJECT_ID/rest-api-service:v1.0

# Push to Google Container Registry
docker push gcr.io/$PROJECT_ID/rest-api-service:v1.0

# Verify image in registry
gcloud container images list --repository=gcr.io/$PROJECT_ID
```

---

## ☸️ Kubernetes Deployment

### Prerequisites

- GKE cluster created and configured
- kubectl authenticated to your GKE cluster
- Container image pushed to registry

### Deploy to GKE

```bash
# Update kubernetes-deployment.yaml with your PROJECT_ID
# Replace [PROJECT-ID] with your actual GCP project ID

# Apply deployment and service
kubectl apply -f kubernetes-deployment.yaml

# Check pods are running
kubectl get pods -l app=rest-api

# Check service and external IP
kubectl get svc rest-api-service

# Port-forward for local testing (until LoadBalancer IP is assigned)
kubectl port-forward svc/rest-api-service 8080:80

# Test API through external IP
EXTERNAL_IP=$(kubectl get svc rest-api-service -o jsonpath='{.status.loadBalancer.ingress[0].ip}')
curl http://$EXTERNAL_IP/api/items
```

### View Logs

```bash
# View logs from a specific pod
kubectl logs -f deployment/rest-api-service

# View logs from all pods
kubectl logs -f deployment/rest-api-service -c api-container --all-containers=true
```

### Delete Deployment

```bash
kubectl delete -f kubernetes-deployment.yaml
```

---

## 🔄 CI/CD Pipeline (Cloud Build)

### Prerequisites

- GitHub repository connected to Cloud Build
- Cloud Build service account has necessary permissions

### Setup Cloud Build

```bash
# Create Cloud Build trigger
gcloud builds submit --config=cloudbuild.yaml

# Or configure webhook trigger in Cloud Build console
# Repository: [your GitHub repo]
# Branch: main
# Build config file: cloudbuild.yaml
```

### Pipeline Stages

1. **Build** – Compile Dockerfile and create image
2. **Push** – Push image to container registry with tag `$SHORT_SHA`
3. **Deploy** – Deploy to GKE using updated image

### View Build History

```bash
# List recent builds
gcloud builds list

# View specific build logs
gcloud builds log BUILD_ID

# Stream live build logs
gcloud builds log BUILD_ID --stream
```

---

## 🔒 Security Considerations

✅ **Non-root user execution** – App runs as user 1001  
✅ **Read-only root filesystem** – Prevents container tampering  
✅ **Resource limits** – CPU and memory constraints prevent resource exhaustion  
✅ **Health probes** – Liveness & readiness prevent bad pods from receiving traffic  
✅ **No credentials in code** – Uses environment variables for configuration  
✅ **Multi-stage Dockerfile** – Reduces final image size and attack surface  

---

## ⚠️ Known Limitations

- **Stateless API** – Data stored in memory; lost on pod restart
- **No authentication** – API endpoints are publicly accessible
- **No database** – No persistent data storage
- **No metrics** – No Prometheus/Grafana monitoring (added in Stage 2)
- **Manual scaling** – No horizontal pod autoscaler (added in Stage 3)

---

## 📊 Architecture Diagram

[See SUBMISSION_WRITEUP.md for architecture diagram showing GitHub → Cloud Build → Container Registry → GKE → LoadBalancer → External API]

---

## 🛠️ Troubleshooting

### Pod fails to start with ImagePullBackOff
```bash
# Check image pull policy and registry credentials
kubectl describe pod <pod-name>
kubectl get events --sort-by='.lastTimestamp'
```

### LoadBalancer external IP stuck in pending
```bash
# Check GKE node pool quotas
kubectl get nodes
gcloud container clusters describe my-cluster --zone australia-southeast1-a
```

### Cloud Build fails with permission denied
```bash
# Check Cloud Build service account permissions
gcloud projects get-iam-policy PROJECT_ID \
  --flatten="bindings[].members" \
  --filter="bindings.members:cloudbuild*"
```

### API endpoints return 404
```bash
# Verify service routing and endpoints
kubectl get endpoints rest-api-service
kubectl get svc rest-api-service -o yaml
```

---

## 📚 Resources

- [Docker Documentation](https://docs.docker.com/)
- [Kubernetes Documentation](https://kubernetes.io/docs/)
- [Google Cloud Build](https://cloud.google.com/build/docs)
- [GKE Documentation](https://cloud.google.com/kubernetes-engine/docs)
- [Express.js Guide](https://expressjs.com/)

---

## 📝 Project Stages

**Stage 1 (Week 7):** ✅ Basic deployment, Kubernetes, CI/CD  
**Stage 2 (Weeks 8-9):** Monitoring, observability, alerting  
**Stage 3 (Weeks 10-12):** Reliability, auto-scaling, optimization  

---

## 📄 License

MIT License – See repository for details

---

**Last Updated:** [Current Date]  
**Status:** Stage 1 Complete – Ready for Review
