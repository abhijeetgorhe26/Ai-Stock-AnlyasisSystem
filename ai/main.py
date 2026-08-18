from fastapi import FastAPI

app = FastAPI(title="AI Stock Analysis API")

@app.get("/api/health")
def health_check():
    return {
        "status": "success",
        "message": "AI service is running successfully"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
