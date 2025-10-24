# Exercise 1
## Running Containers
Showing running containers with command "docker images":

![EX1-01](./screenshots/ex1-01.png)

Searching for a specific image with command "docker search <name>":

![EX1-02](./screenshots/ex1-02.png)

Pulling an image from DockerHub

![EX1-03](./screenshots/ex1-03.png)

Pulling a diffrent version of an image:

![EX1-04](./screenshots/ex1-04.png)

Running "docker images" again:

![EX1-05](./screenshots/ex1-05.png)

Deleting the Ubuntu 22.10 image:

![EX1-06](./screenshots/ex1-06.png)

Running "docker images" again :

![EX1-07](./screenshots/ex1-07.png)

Deletig all images from the system - If a container is currently running, its image will remain:

![EX1-08](./screenshots/ex1-08.png)

Running ubuntu:22.04 container to show text "Hello World!" :

![EX1-09](./screenshots/ex1-09.png)

Running command "docker ps":

![EX1-10](./screenshots/ex1-10.png)

Running previous command with a flag "-a":

![EX1-11](./screenshots/ex1-11.png)

Running "docker run ubuntu:22.04 /bin/bash":

![EX1-12](./screenshots/ex1-12.png)

Then showing all containers:

![EX1-13](./screenshots/ex1-13.png)

Entering a bash session in ubuntu container:

![EX1-14](./screenshots/ex1-14.png)

Looking at the file system with Linux commands:

![EX1-15](./screenshots/ex1-15.png)

Running "/bin/sleep 3600" in detached mode:

![EX1-16](./screenshots/ex1-16.png)

Checking the container:

![EX1-17](./screenshots/ex1-17.png)

Using docker exec, rather than docker run.The ID is different from the previous image due to the container being restarted:

![EX1-18](./screenshots/ex1-18.png)

Listing the running processes:

![EX1-19](./screenshots/ex1-19.png)

Container is still running, even after exit:

![EX1-20](./screenshots/ex1-20.png)

Stoping a container and seeing results:

![EX1-21](./screenshots/ex1-21.png)

Showing all containers:

![EX1-22](./screenshots/ex1-22.png)

Removing a container:

# Exercise 2
## Changing images

For this excercise we're pulling ubuntu 16.04 image

