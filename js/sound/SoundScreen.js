// Copyright 2020, University of Colorado Boulder

/**
 * @author Piet Goris
 */

import Screen from '../../../joist/js/Screen.js';
import SoundColors from '../common/SoundColors.js';
import ScreenIcon from '../../../../joist/js/ScreenIcon.js';
import sound from '../sound.js';
import Dimension2 from '../../../dot/js/Dimension2.js';

class SoundScreen extends Screen {

  /**
   * @param {Tandem} tandem
   */
  constructor( tandem, title, createModel, createView, iconImage) {

    const options = {
      //TODO if you include homeScreenIcon or navigationBarIcon, use JOIST/ScreenIcon
      backgroundColorProperty: SoundColors.SCREEN_VIEW_BACKGROUND,
      tandem: tandem,
      name: title,
      homeScreenIcon: new ScreenIcon(iconImage, {
        size: new Dimension2(Screen.MINIMUM_HOME_SCREEN_ICON_SIZE.height, Screen.MINIMUM_HOME_SCREEN_ICON_SIZE.height),
        maxIconWidthProportion: 1,
        maxIconHeightProportion: 1
      })
    };

    super(
      createModel,
      createView,
      options
    );
  }
}

sound.register( 'SoundScreen', SoundScreen );
export default SoundScreen;