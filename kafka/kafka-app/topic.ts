import { ITopicConfig, Kafka } from "kafkajs";

const TOPICS_TO_CREATE = (process.env.TOPICS_TO_CREATE || 'users').split(',').map(s => s.trim());
const topics: ITopicConfig[] = TOPICS_TO_CREATE.map(t => {return { topic: t }});
// default will be container network name, otherwise the argument which you can provide
const KAFKA_HOST = process.argv[2] || 'kafka';

const run = async () => {
  const kafka = new Kafka({
    clientId: 'my-app',
    brokers: [`${KAFKA_HOST}:9092`],
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
