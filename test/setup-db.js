import { beforeAll, afterAll } from 'vitest';
import setup from './setup.js';
import teardown from './teardown.js';

beforeAll(async () => {
    await setup();
});

afterAll(async () => {
    await teardown();
});
