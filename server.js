import Fastify from 'fastify';
import Scalar from '@scalar/fastify-api-reference'
import HttpProxy from '@fastify/http-proxy'
import Swagger from '@fastify/swagger'

async function startOrigin () {
  const origin = Fastify({ logger: { name: 'origin' } })
  await origin.register(Swagger, {
    exposeRoute: true,
    swagger: {
      info: {
        title: 'Origin API',
        description: 'API for the origin service',
        version: '0.1.0'
      }
    }
  })
  await origin.register(Scalar, {
    routePrefix: '/documentation',
    publicPath: './'
  })
  origin.get('/origin', async (request, reply) => {
    return { origin: 'origin' }
  })
  await origin.listen({ port: 4000 })
}

async function startProxy () {
  const proxy = Fastify({ logger: { name: 'proxy' } })
  proxy.register(HttpProxy, {
    upstream: 'http://localhost:4000',
    prefix: '/proxy'
  })
  await proxy.listen({ port: 4001 })
}


await startOrigin()
await startProxy()
