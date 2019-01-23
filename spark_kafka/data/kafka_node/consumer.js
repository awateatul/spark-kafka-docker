var kafka = require('kafka-node');

const consumerOptions = {
    groupId: 'org.apache.spark',
    sessionTimeout: 5000,
    protocol: ['roundrobin'],
    asyncPush: false,
    id: 'consumer1',
    fromOffset: 'earliest',
    autoCommit: false
  };

var Consumer = kafka.Consumer,
    client = new kafka.KafkaClient({kafkaHost: "spark_kafka:29092"}),
    consumer = new Consumer(
        client,
        [
            { topic: 'foo', partition: 0 }
        ],
        consumerOptions
    );
consumer.on('message', function (message) {
    console.log(message);
});
consumer.on('error', function (err) {
    console.log('Error ' + JSON.stringify(err));
});
