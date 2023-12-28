from modal import Image, Stub, web_endpoint
import requests
import json
import os


def url2dict(url):
    response = requests.get(url)
    return json.loads(response.text)


image = Image.debian_slim(python_version="3.10").pip_install(
    "accelerate~=0.18.0",
    "transformers~=4.28.1",
    "torch~=2.0.0",
    "sentencepiece~=0.1.97",
    "pillow",
)

stub = Stub(name="BackendServer", image=image)


@stub.function(timeout=60)
@web_endpoint()
def runit(modelconfig: str, inputs: str, modality: str, task: str):
    from transformers import pipeline

    modelconfig = url2dict(modelconfig)
    modelname = f"{modelconfig['username']}/{modelconfig['modelname']}"
    if modality == "text":
        if task == "generation":
            pipe = pipeline("text-generation", model=modelname)
            return pipe(inputs)
        elif task == "classification":
            pipe = pipeline("text-classification", model=modelname)
        return pipe(inputs)
    if modality == "image":
        if task == "classification":
            pipe = pipeline(model=modelname)
            preds = pipe(inputs)
            return [
                {"score": round(pred["score"], 4), "label": pred["label"]}
                for pred in preds
            ]
    if modality == "audio":
        if task == "classification":
            pipe = pipeline(model=modelname)
            return pipe(inputs)
    else:
        return "Not a valid modality or task"
