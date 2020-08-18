// Copyright 2020, University of Colorado Boulder

/**
 * @author Piet Goris
 */

import Screen from '../../../joist/js/Screen.js';
import SoundColors from '../common/SoundColors.js';
import sound from '../sound.js';
import SoundModel from './model/SoundModel.js';
import SoundScreenView from './view/SoundScreenView.js';

class SoundScreen extends Screen {

  /**
   * @param {Tandem} tandem
   */
  constructor( tandem ) {

    const options = {
      //TODO if you include homeScreenIcon or navigationBarIcon, use JOIST/ScreenIcon
      backgroundColorProperty: SoundColors.SCREEN_VIEW_BACKGROUND,
      tandem: tandem
    };

    super(
      () => new SoundModel( tandem.createTandem( 'model' ) ),
      model => new SoundScreenView( model, tandem.createTandem( 'view' ) ),
      options
    );
  }
}

sound.register( 'SoundScreen', SoundScreen );
export default SoundScreen;