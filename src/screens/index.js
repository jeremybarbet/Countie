import { createRouter } from '@expo/ex-navigation';

import Welcome from './welcome';
import Counter from './counter';

const Router = createRouter(() => ({
  welcome: () => Welcome,
  counter: () => Counter,
}), {
  ignoreSerializableWarnings: true,
});

export default Router;
