import React from 'react';
import { addDecorator, configure } from '@storybook/react';

import { DungeonDelverTheme } from 'ui/core/theme';


addDecorator((story) => {
  return (
    <DungeonDelverTheme>
      {story()}
    </DungeonDelverTheme>
  )
});

configure(require.context('../src/stories', true, /\.stories\.js$/), module);
