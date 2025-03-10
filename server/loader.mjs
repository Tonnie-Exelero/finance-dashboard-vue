import { resolve as resolveTs } from 'ts-node/esm';
import { pathToFileURL } from 'url';

export { load, resolve };

async function resolve(specifier, context, defaultResolve) {
  return resolveTs(specifier, context, defaultResolve);
}

async function load(url, context, defaultLoad) {
  const { format } = await defaultLoad(url, context, defaultLoad);
  return { format };
}