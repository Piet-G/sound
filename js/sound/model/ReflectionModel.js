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
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Property from '../../../../axon/js/Property.js';
import TemporalMask from '../../common/model/TemporalMask.js';
import Range from '../../../../dot/js/Range.js';

class ReflectionModel extends SoundModel {
  constructor() {
    super(Tandem.ROOT.createTandem('model'), {
      //speaker1PositionY: 1/3 * SoundConstants.WAVE_AREA_WIDTH
    });

    this.wallPositionXProperty = new NumberProperty(1 / 3 * SoundConstants.WAVE_AREA_WIDTH, {
      range: new Range( 1 / 3 * SoundConstants.WAVE_AREA_WIDTH, 2/3 * SoundConstants.WAVE_AREA_WIDTH )
    });
    this.wallAngleProperty = new NumberProperty(Math.PI / 4, {
		range: new Range( 1/10 * Math.PI, 1/2 * Math.PI )
    });

    //this.listenerPositionProperty = new Vector2Property(new Vector2(200, 1/2 * SoundConstants.WAVE_AREA_WIDTH));
    //this.speaker2PositionProperty = new Vector2Property(new Vector2(this.modelToLatticeTransform.viewToModelX(this.sourcePositionX), 2/3 * SoundConstants.WAVE_AREA_WIDTH));
	// @private
    //this.temporalMask1 = new TemporalMask(this.wallPositionXProperty, this.wallAngleProperty, false, this.modelToLatticeTransform);

    // @private
    //this.temporalMask2 = new TemporalMask(this.wallPositionXProperty, this.wallAngleProperty, true, this.modelToLatticeTransform);

    this.wallPositionXProperty.link( prop => {
		//this.updateInvisibleSpeakerPosition();
	});

	this.wallAngleProperty.link( prop => {
		//this.updateInvisibleSpeakerPosition();
	});

    // @public - indicates the user selection for the sound mode control setting
    this.soundModeProperty = new Property( SoundModel.SoundModeOptions.CONTINUOUS, {
      validValues: SoundModel.SoundModeOptions.VALUES
    });
  }

   /**
   * Called when the primary button is toggled.  Can be overriden for scene-specific behavior.
   * @param {boolean} isPressed
   * @protected
   */
  handleButton1Toggled( isPressed ) {
    if ( isPressed  ) {
      this.resetPhase();
    }
    if ( isPressed && this.soundModeProperty.value === SoundModel.SoundModeOptions.PULSE) {
      this.startPulse();
    }
    else {

      // Water propagates via the water drop
      //this.continuousWave1OscillatingProperty.value = isPressed;
    }
  }

}

sound.register( 'ReflectionModel', ReflectionModel );
export default ReflectionModel;