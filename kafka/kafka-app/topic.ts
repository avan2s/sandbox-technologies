import { ITopicConfig, Kafka } from "kafkajs";

const topics: ITopicConfig[] = [{ topic: 'Users', numPartitions: 2 }];

const run = async () => {
  const kafka = new Kafka({
    clientId: 'my-app',
    brokers: ['kafka:9092'], // Use the service name defined in docker-compose.yml
  });

  const admin = kafka.admin();
  console.log('Connecting...');
  const foo = await admin.connect();
  console.log('Connected');
  await admin.createTopics({
    topics: topics,
  });
  console.log(`Created topics: ${topics.map(t => t.topic).join(',')}`);
  await admin.disconnect();
  console.log('Disconnected');
};

run().catch(console.error);
