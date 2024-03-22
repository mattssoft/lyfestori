import { config } from '@keystone-6/core';
import { lists } from './configs/schema';
import { withAuth, session } from './configs/auth';
import { allowedOrigins } from './configs/allowedOrigins';

const {POSTGRES_USER, POSTGRES_PASSWORD, POSTGRES_DB, PORT } = process.env

export default 
withAuth(
  config({
    server: {
      cors: { 
        origin: allowedOrigins, 
        credentials: true 
      }
    },
    db: {
      provider: 'postgresql',
      url: `postgres://${POSTGRES_USER}:${POSTGRES_PASSWORD}@postgres/${POSTGRES_DB}`, 
      enableLogging: true,
      idField: { kind: 'uuid' }
    },
    lists,
    session,
    storage: {
      journal_item_files: {
        kind: 'local',
        type: 'file',
        generateUrl: path => `http://localhost:${PORT}/files${path}`,
        serverRoute: {
          path: '/files',
        },
        storagePath: 'public/files'
      }
    }
  })
);
