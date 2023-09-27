import { Kafka } from "kafkajs";


  

//   await producer.connect();

//   const run = async () => {
//     const kafka = new Kafka({
//         clientId: 'my-app',
//         brokers: ['localhost:9092']
//       });
//       const message = 'Hello KafkaJS user!';
//     // Producing
//     await producer.connect()
//     console.log(message);
//     await producer.send({
//       topic: 'test-topic',
//       messages: [
//         { value: message },
//       ],
//     })
//   }
  
//   run().catch(console.error);