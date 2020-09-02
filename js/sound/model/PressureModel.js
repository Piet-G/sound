// Copyright 2020, University of Colorado Boulder

/**
 * @author Piet Goris
 */

import SoundModel from './SoundModel.js';
import Property from '../../../../axon/js/Property.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import sound from '../../sound.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import Vector2Property from '../../../../dot/js/Vector2Property.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Range from '../../../../dot/js/Range.js';

import SoundConstants from '../../common/SoundConstants.js';

class SingleSourceModel extends SoundModel {
  constructor() {
    super(Tandem.ROOT.createTandem('model'), {});

    // @public - whether audio is enabled
    this.isAudioEnabledProperty = new BooleanProperty( false );

    // @public - controls the air pressure in the box.
    this.pressureProperty = new NumberProperty( 1, {
      range: new Range( 0, 1 )
    } );

    // @public - indicates the user selection for the audio control setting
    this.audioControlSettingProperty = new Property( SoundModel.AudioControlOptions.SPEAKER, {
      validValues: SoundModel.AudioControlOptions.VALUES
    });

    // @public - position of the listener
    this.listenerPosition = new Vector2(1/2 * SoundConstants.WAVE_AREA_WIDTH, SoundConstants.WAVE_AREA_WIDTH / 2);

  }
}

sound.register( 'SingleSourceModel', SingleSourceModel );
export default SingleSourceModel;