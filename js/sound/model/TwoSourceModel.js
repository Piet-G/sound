// Copyright 2020, University of Colorado Boulder

/**
 * @author Piet Goris
 */

import SoundModel from './SoundModel.js';
import SoundConstants from '../../common/SoundConstants.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import sound from '../../sound.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Vector2Property from '../../../../dot/js/Vector2Property.js';
import BooleanProperty from '../../../../axon/js/BooleanProperty.js';


class TwoSourceModel extends SoundModel {
  constructor() {
    super(Tandem.ROOT.createTandem('model'), {
      speaker1PositionY: 1/3 * SoundConstants.WAVE_AREA_WIDTH
    });


    // @public - whether audio is enabled
    this.isAudioEnabledProperty = new BooleanProperty( false );

    this.listenerPositionProperty = new Vector2Property(new Vector2( 1/2 * SoundConstants.WAVE_AREA_WIDTH, 1/2 * SoundConstants.WAVE_AREA_WIDTH));
    this.speaker2PositionProperty = new Vector2Property(new Vector2(this.modelToLatticeTransform.viewToModelX(this.sourcePositionX), 2/3 * SoundConstants.WAVE_AREA_WIDTH));
  }
}

sound.register( 'TwoSourceModel', TwoSourceModel );
export default TwoSourceModel;