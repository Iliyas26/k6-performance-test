import { check } from 'k6';
import { Writer, Reader } from 'k6/x/kafka';
import encoding from 'k6/encoding';

// Kafka broker details
const brokers = ['localhost:9092'];
const topic = 'test-topic';

// Kafka producer configuration
const writer = new Writer({
    brokers: brokers,
    topic: topic,
	autoCreateTopic: true,
});

// Kafka consumer configuration
const reader = new Reader({
    brokers: brokers,
    topic: topic,
    groupId: 'k6-consumer-group',
    autoOffsetReset: 'earliest', // 'latest' to read only new messages
});

function toBase64(str){
	return encoding.b64encode(str);
}

export default function () {
	
	const messageValue = JSON.stringify({ orderId: '12345', status: 'processed' })
    // Produce a message to Kafka
    let message = {
        key: 'key-1',
        value: toBase64(messageValue),
    };

    writer.produce([message]);
    console.log(`Produced message: ${message.value}`);

    // Consume messages from Kafka
    let msgs = reader.consume({ limit: 1, duration: '5s' });

    check(msgs, {
        'Message received': (msgs) => msgs.length > 0,
        'Message content correct': (msgs) =>
            msgs[0].value === JSON.stringify({ orderId: '12345', status: 'processed' }),
    });

    if (msgs.length > 0) {
        console.log(`Consumed message: ${msgs[0].value}`);
    } else {
        console.error('No messages consumed');
    }
}

export function teardown() {
    writer.close();
    reader.close();
}