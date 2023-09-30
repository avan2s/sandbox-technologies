import { ITopicConfig, Kafka } from "kafkajs";

const TOPICS_TO_MAINTAIN: ITopicConfig[] = (process.env.TOPICS_TO_CREATE || 'users').split(',').map(s => s.trim())
.map(t => {return { topic: t, numPartitions: 2 }});
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
  const existingTopics = await admin.listTopics();
  const topicsToCreate: ITopicConfig[] = TOPICS_TO_MAINTAIN.filter(t => !existingTopics.includes(t.topic));

  if(topicsToCreate.length > 0) {
    await admin.createTopics({
      topics: topicsToCreate,
    });
    console.log(`Created topics: ${topicsToCreate.map(t => t.topic).join(',')}`);
  } else {
    console.log(`topics already exist`)
  }
  await admin.disconnect();
  console.log('Disconnected');
};

run().catch(console.error);
