# Use this for GPU machine
#FROM mambaorg/micromamba:1.4-jammy-cuda-11.8.0

# Use this for non-GPU machine
FROM mambaorg/micromamba:1.4-jammy


WORKDIR /app

COPY ./app.py /app   
COPY ./image_caption.py /app
COPY ./requirements.txt /app
COPY ./video_caption.py /app
COPY ./environment.yml /app

RUN micromamba env create --file environment.yml

# Demonstrate the environment can be activated (build-time):
# SHELL ["micromamba", "run", "-n", "myenv1", "/bin/bash", "-c"]

# Demonstrate the environment can be activated (run-time):
ENTRYPOINT ["micromamba", "run", "-n", "myenv1", "python", "app.py"]


