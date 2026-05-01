# 🚀 Cloud-Native Capstone Project - Quick Start Guide

## ✅ What's Included

You now have a complete cloud-native REST API project with:

- ✅ **app.js** – Node.js/Express API with 5 endpoints
- ✅ **package.json** – Dependencies configuration
- ✅ **Dockerfile** – Multi-stage build optimized for production
- ✅ **kubernetes-deployment.yaml** – GKE Deployment & LoadBalancer Service
- ✅ **cloudbuild.yaml** – CI/CD pipeline configuration
- ✅ **README.md** – Comprehensive project documentation
- ✅ **SUBMISSION_WRITEUP.md** – Complete Stage 1 submission document
- ✅ **.gitignore** – Git configuration
- ✅ **Architecture Diagram** – Visual overview of the system

---

## 🎯 Next Steps (In Order)

### Step 1: Create GitHub Repository (10 minutes)
```bash
# Create new repo on GitHub.com (name: cloud-native-rest-api)
# Clone it locally
git clone https://github.com/YOUR_USERNAME/cloud-native-rest-api.git
cd cloud-native-rest-api

# Copy all project files to this directory
# Commit and push to GitHub
git add .
git commit -m "Initial commit: cloud-native REST API"
git push origin main
```

### Step 2: Test Locally (15 minutes)
```bash
# Install dependencies
npm install

# Run the API server
npm start

# In another terminal, test the endpoints:
curl http://localhost:3000/health
curl http://localhost:3000/api/items
```

### Step 3: Build & Test Docker Image (15 minutes)
```bash
# Build the image
docker build -t rest-api-service:v1.0 .

# Run container
docker run -p 3000:3000 rest-api-service:v1.0

# Test from another terminal
curl http://localhost:3000/api/items
```

### Step 4: Setup GCP & Container Registry (20 minutes)
```bash
# Set your project ID
export PROJECT_ID=$(gcloud config get-value project)
echo "Your project ID: $PROJECT_ID"

# Enable required APIs
gcloud services enable container.googleapis.com cloudbuild.googleapis.com

# Tag and push image to Google Container Registry
docker tag rest-api-service:v1.0 gcr.io/$PROJECT_ID/rest-api-service:latest
docker push gcr.io/$PROJECT_ID/rest-api-service:latest

# Verify image is there
gcloud container images list
```

### Step 5: Update Kubernetes Manifest (5 minutes)
Edit **kubernetes-deployment.yaml**:
- Replace `[PROJECT-ID]` with your actual GCP project ID
- Line 31: `image: gcr.io/[PROJECT-ID]/rest-api-service:latest`

```bash
# Example
sed -i 's/\[PROJECT-ID\]/my-project-12345/g' kubernetes-deployment.yaml
```

### Step 6: Deploy to GKE (20 minutes)
```bash
# Make sure you're authenticated to your GKE cluster
gcloud container clusters get-credentials my-cluster --zone australia-southeast1-a

# Deploy to Kubernetes
kubectl apply -f kubernetes-deployment.yaml

# Check pods are running
kubectl get pods -l app=rest-api
# Expected output: 2 pods with status "Running"

# Check service and external IP
kubectl get svc rest-api-service
# Wait for EXTERNAL-IP to change from <pending> to an IP address (may take 1-2 minutes)

# Once you have the EXTERNAL-IP, test it:
EXTERNAL_IP=$(kubectl get svc rest-api-service -o jsonpath='{.status.loadBalancer.ingress[0].ip}')
curl http://$EXTERNAL_IP/api/items
```

### Step 7: Setup Cloud Build Pipeline (15 minutes)
```bash
# Option A: Using command line
gcloud builds submit --config=cloudbuild.yaml

# Option B: Setup automatic trigger (recommended)
# 1. Go to Cloud Build console: https://console.cloud.google.com/cloud-build
# 2. Click "Create Trigger"
# 3. Connect your GitHub repository
# 4. Set Build config to "cloudbuild.yaml"
# 5. Create trigger
# 6. Push code to GitHub to automatically trigger builds
```

### Step 8: Collect Evidence & Screenshots (20 minutes)

Take screenshots for your submission:

**8a) Docker Build Evidence**
```bash
docker build -t rest-api-service:v1.0 .
# Screenshot: "Successfully built [IMAGE_ID]"
```

**8b) Container Image in Registry**
```bash
gcloud container images list --repository=gcr.io/$PROJECT_ID
# Screenshot: Image listed
```

**8c) Kubernetes Pods Running**
```bash
kubectl get pods -l app=rest-api
# Screenshot: Both pods with status "Running"
```

**8d) Service with External IP**
```bash
kubectl get svc rest-api-service
# Screenshot: External-IP populated with IP address
```

**8e) API Health Check**
```bash
curl http://$EXTERNAL_IP/health
# Screenshot: {"status":"healthy",...}
```

**8f) Cloud Build Pipeline**
- Go to Cloud Build console → Build History
# Screenshot: Build succeeded with all steps green

**8g) API Endpoint Test**
```bash
curl http://$EXTERNAL_IP/api/items
# Screenshot: JSON response with items
```

### Step 9: Fill in Submission Document (15 minutes)

Edit **SUBMISSION_WRITEUP.md**:
- Replace `[Your Name]` with your name
- Replace `[Your ID]` with your student ID
- Replace `[Your GitHub link]` with your repo URL
- Paste the screenshots you collected into the evidence section
- Update any paths/IPs specific to your GCP project

### Step 10: Final Submission Checklist

Before submitting, verify you have:

- [ ] GitHub repository created with all code
- [ ] Docker image built and tested locally
- [ ] Docker image pushed to Container Registry
- [ ] Kubernetes Deployment running with 2 pods
- [ ] Kubernetes Service has external IP assigned
- [ ] API endpoints responding correctly
- [ ] Cloud Build pipeline configured and tested
- [ ] All 7 screenshots collected and inserted
- [ ] SUBMISSION_WRITEUP.md filled in with your details
- [ ] README.md customized with your info
- [ ] cloudbuild.yaml updated with correct cluster/zone
- [ ] kubernetes-deployment.yaml updated with your PROJECT_ID
- [ ] All files committed to GitHub
- [ ] Architecture diagram saved (you have one!)

---

## 🐛 Common Issues & Solutions

### "Permission denied: pushing to Container Registry"
**Solution:** Use `gcloud auth configure-docker` first
```bash
gcloud auth configure-docker
docker push gcr.io/$PROJECT_ID/rest-api-service:latest
```

### "Pods stuck in ImagePullBackOff"
**Solution:** Check image exists and service account can pull it
```bash
# Verify image exists
gcloud container images list --repository=gcr.io/$PROJECT_ID

# Check pod error
kubectl describe pod POD_NAME
```

### "LoadBalancer external IP stuck in pending"
**Solution:** Check GKE node pool and quotas
```bash
kubectl get nodes
gcloud container clusters describe my-cluster
```

### "Cloud Build fails: gke-deploy not found"
**Solution:** Use the full path in cloudbuild.yaml
```yaml
- name: 'gcr.io/cloud-builders/gke-deploy'
  args: ['run', '--filename=.', ...]
```

---

## 📞 Getting Help

**Documentation:**
- Kubernetes: https://kubernetes.io/docs/
- Docker: https://docs.docker.com/
- Cloud Build: https://cloud.google.com/build/docs
- GKE: https://cloud.google.com/kubernetes-engine/docs

**Deakin Resources:**
- Course materials on CloudDeakin
- Workshop recordings
- Tutor office hours

**Stack Overflow:**
- Tag: `kubernetes`, `docker`, `google-cloud-platform`

---

## ⏱️ Time Estimate

- Step 1: 10 min
- Step 2: 15 min
- Step 3: 15 min
- Step 4: 20 min
- Step 5: 5 min
- Step 6: 20 min
- Step 7: 15 min
- Step 8: 20 min
- Step 9: 15 min
- **Total: ~2.5 hours**

---

## 🎓 What You'll Learn

By completing this project, you'll demonstrate:
- ✅ Understanding of containerisation (Docker)
- ✅ Ability to deploy on Kubernetes
- ✅ CI/CD pipeline automation
- ✅ Cloud-native architecture design
- ✅ Security best practices
- ✅ Project planning & time management

---

## 📋 Project Submission Files

All files are ready to download:
1. **app.js** – Application code
2. **package.json** – Dependencies
3. **Dockerfile** – Container definition
4. **kubernetes-deployment.yaml** – K8s manifests
5. **cloudbuild.yaml** – CI/CD config
6. **README.md** – Documentation
7. **SUBMISSION_WRITEUP.md** – Submission document
8. **.gitignore** – Git config

---

Good luck with your capstone project! 🚀

**Need help? Ask me:**
- "Walk me through deploying to GKE"
- "How do I test the Kubernetes deployment?"
- "What does the health check do?"
- "How do I connect GitHub to Cloud Build?"
