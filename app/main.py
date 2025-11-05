from fastapi import FastAPI
app=FastAPI()
@app.get("/test")
def readroot():
    return{"message":"Agrovihans agropulse is alive"}