import { Kafka } from "kafkajs";

  const run = async () => {
    const kafka = new Kafka({
        clientId: 'my-app',
        brokers: ['kafka:9092']
      });
   
    const producer = kafka.producer({allowAutoTopicCreation: false});
    console.log('Connecting...');
    await producer.connect()
    console.log('Connected!');
    for(let i = 0; i < 10; i++) {
      const message = `Hello KafkaJS user ${i+1}!`;
      console.log(`Producing message ${message}`);
      await producer.send({
        topic: 'Users',
        messages: [
          { value: message },
        ],
      })
    }
  }
  
  run().catch(console.error);