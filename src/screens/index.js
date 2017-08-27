import { createRouter } from '@expo/ex-navigation';

import Welcome from './welcome';

const Router = createRouter(() => ({
  welcome: () => Welcome,
}), {
  ignoreSerializableWarnings: true,
});

export default Router;
