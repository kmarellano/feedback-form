import 'dotenv/config';
import { app } from './app';
import { SERVER_CONFIG } from '@/config/appConfig';

const PORT = SERVER_CONFIG.PORT;
const server = app.listen(PORT, () => {
  console.log('Server Running on PORT: ', PORT);
});

export { server, app };
