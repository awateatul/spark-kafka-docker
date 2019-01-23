# spark-kafka-docker
Setup Spark and Kafka in docker. Publish a topic in Kafka and consume it in Spark.  I have built the image with spark 2.4.0 version. This document assumes that you have some basic knowledge about spark and kafka.
## Introduction
The distribution consists of 3 different docker-compose.yml files in 3 different folders. One is for spark, one is for kafka and the last one is for running spark in standalone mode for some quick testing.

## Getting started
  - Download the spark_kafka.zip file.
  - Unzip it in some work folder. This will create a folder called spark_kafka. Go into that folder.
  - Run the command to create a network
  
      `docker create network 24_spark-stream`

#### Kafka
  - Change to kafka folder.
  - Run the command

      `docker-compose up -d`
  - This will get Kafka and Zookeeper running.
  
#### Spark
  - Change to spark folder
  - Run the command
  
      `docker-compose up -d`
  - This will start spark-master and 1 spark-worker
  
#### Spark Standalone
You can run spark in standalone mode to test messaging.
  - Change to spark-standlone folder
  - Run the command
  
      `docker-compose up -d`
      
  - You will have to download kafka client jars to run the test program. Do this on the host machine.
    - kafka-clients
    - spark-streaming-kafka
  - Copy those files to the mounted data/lib folder. This will make it accessible to the docker images.
  - From the host machine run the following command. This will give a warning first time since the topic "foo" doesn't exist.
  
    `docker exec -it spark_kafka bash -c "echo 'Hello world' | kafka-console-producer --request-required-acks 1 --broker-list localhost:29092 --topic foo"`
  - Login into the spark-standalone machine
  
    `docker exec -it spark-helper /bin/bash`
  -  To run the streaming consumer java client run the following command.
  
    `java -cp .:/opt/spark/conf:/opt/spark/jars/*:/data/lib/* -Xmx1g org.apache.spark.deploy.SparkSubmit --jars /opt/spark/examples/jars/spark-examples_2.11-2.4.0.jar,/opt/spark/examples/jars/scopt_2.11-3.7.0.jar --class spark.JavaDirectKafkaWordCount spark-internal spark_kafka:29092 org.apache.spark foo`
  - You will see bunch of messages scrolling by. You can run the producer command multiple times after this and see the Produced messages consumed by the java client.
  
    `docker exec -it spark_kafka bash -c "echo 'Hello world second time' | kafka-console-producer --request-required-acks 1 --broker-list localhost:29092 --topic foo"`
  
  - You can also test the consumer directly on the command line if you don't want to run spark. Experiment with the offset.
  
  `docker exec -it spark_kafka kafka-console-consumer --bootstrap-server localhost:29092 --topic foo  --offset 0 --max-messages 4`
  
## Conclusion
I have tested this on Mac only.  You can experiment with different options for Spark and Kafka. You can create multiple topics.  I have written a node producer and consumer and will check that in when I get a chance. Meanwhile if you have any questions feel free to reach out to me.
