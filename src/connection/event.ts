import { EventEmitter } from 'events';
import { type ResponseMessage } from '@/types/mainIo';

const eventEmitter = new EventEmitter();
eventEmitter.setMaxListeners(Infinity);

export const emitEvent = <T extends object>(
	id: string,
	owner: string,
	data: ResponseMessage<T>,
	status: boolean,
): void => {
	eventEmitter.emit(`${id}-${owner}`, data, status);
};

export const onEvent = <T extends object>(
	id: string,
	owner: string,
	callback: (data: ResponseMessage<T>, status: boolean) => void,
): void => {
	eventEmitter.once(`${id}-${owner}`, callback);
};
