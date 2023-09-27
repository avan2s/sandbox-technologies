import { Consumer, Kafka } from "kafkajs";
const CONSUMER_GROUP = process.env.CONSUMER_GROUP || 'consumergroup1';
const SUBSCRIBED_TOPICS = (process.env.SUBSCRIBED_TOPICS || 'topic').split(',').map(s => s.trim());

async function retryOperation(operation: Function, maxTries=10, delayMs=1000) {
    let tries = 0;
    while (tries < maxTries) {
      try {
        await operation();
        return; // Operation succeeded, exit the retry loop
      } catch (error: unknown) {
        tries++;
        if (tries < maxTries) {
          console.log(`Retrying in ${delayMs} ms...`);
          await new Promise(resolve => setTimeout(resolve, delayMs));
        } else {
          throw new Error(`Max retry attempts (${maxTries}) reached. Operation failed.`);
        }
      }
    }
  }
  

  const run = async () => {
    const kafka = new Kafka({
        clientId: 'my-app',
        brokers: ['kafka:9092']
      });
   
    const consumer = kafka.consumer({groupId: CONSUMER_GROUP });
    console.log('Connecting...');
    await consumer.connect()
    console.log('Connected!');
    //   console.log(`Producing message ${message}`);
    await retryOperation(async () => {
        await consumer.subscribe({ topics: SUBSCRIBED_TOPICS, fromBeginning: true });
    });

    // await consumer.subscribe({topics: SUBSCRIBED_TOPICS, fromBeginning: true});
    consumer.run({
        eachMessage: async (payload) => {
            console.log(`Received [topic=${payload.topic}}]-message ${payload.message.value} on partition ${payload.partition}`);
    }})
    
  }
  
  run().catch(console.error);


  