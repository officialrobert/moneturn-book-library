'use strict';

import assert from 'assert/strict';
import { test } from 'node:test';
import { build } from '.';

test('requests the "/" route to return a status code of 200', async () => {
  const app = build();

  const response = await app.inject({
    method: 'GET',
    url: '/',
  });

  assert.equal(
    Number(response.statusCode),
    200,
    'Must return a status code of 200',
  );
});
