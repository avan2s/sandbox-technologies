import { ITopicConfig, Kafka } from "kafkajs";

const TOPICS_TO_CREATE = (process.env.TOPICS_TO_CREATE || 'topic').split(',').map(s => s.trim());
const topics: ITopicConfig[] = TOPICS_TO_CREATE.map(t => {return { topic: t, numPartitions: 2 }});

const run = async () => {
  const kafka = new Kafka({
    clientId: 'my-app',
    brokers: ['kafka:9092'],
  });

  const admin = kafka.admin();
  console.log('Connecting...');
  await admin.connect();
  console.log('Connected');
  await admin.createTopics({
    topics: topics,
  });
  console.log(`Created topics: ${topics.map(t => t.topic).join(',')}`);
  await admin.disconnect();
  console.log('Disconnected');
};

run().catch(console.error);
