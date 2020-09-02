// Copyright 2020, University of Colorado Boulder

/**
 * @author Piet Goris
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Enumeration from '../../../../phet-core/js/Enumeration.js';
import Rectangle from '../../../../dot/js/Rectangle.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';

import SoundConstants from '../../common/SoundConstants.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import sound from '../../sound.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import EventTimer from '../../../../phet-core/js/EventTimer.js';
import WaveInterferenceConstants from '../../../../wave-interference/js/common/WaveInterferenceConstants.js';
import Lattice from '../../../../wave-interference/js/common/model/Lattice.js';
import TemporalMask from '../../common/model/TemporalMask.js';

import validate from '../../../../axon/js/validate.js';
import Range from '../../../../dot/js/Range.js';
import merge from '../../../../phet-core/js/merge.js';

const POSITIVE_NUMBER = {
  valueType: 'number',
  isValidValue: v => v > 0
};

// This simulation uses EventTimer, which provides exactly the same model behavior on very slow and very fast
// platforms.  Here we define the frequency of events in Hz, which has been tuned so that our slowest platform has
// an acceptable frame rate
const eventTimerPeriod = 1 / SoundConstants.EVENT_RATE;
const frequencyRange = new Range(0 / 1000,

          // A4 in cycles per ms, wavelength is  78.4cm
          1000 / 1000);
const INITIAL_FREQUENCY = 500 / 1000;

class SoundModel {

  /**
   * @param {Tandem} tandem
   */
  constructor( tandem, config) {
    config = merge(
    {
        initialAmplitude: 5,
        speaker1PositionY: SoundConstants.WAVE_AREA_WIDTH / 2,
        wallPositionX: null,
        wallAngle: null
    }, config);

    assert && assert(!config.hasAudioControlSettings || config.hasAudioControl);
    assert && assert( tandem instanceof Tandem, 'invalid tandem' );

    //this.waveSpeed = 34.3; // in cm/ms
    
    this.isRunningProperty = new BooleanProperty( true );
    this.isPulseFiringProperty = new BooleanProperty(false);

    this.sourcePositionX = 40;

    this.phase = 0;

    //this.scenes = [this];

    this.stepIndex = 0;

    // @private
    this.temporalMask1 = new TemporalMask(this.wallPositionXProperty, this.wallAngleProperty);

    // @private
    this.temporalMask2 = new TemporalMask(this.wallPositionXProperty, this.wallAngleProperty);

    // @public (read-only) - the value of the wave at the oscillation point
    this.oscillatorProperty = new NumberProperty( 0 );


    const eventTimerModel = {
      // @public
      getPeriodBeforeNextEvent: () => {
        return eventTimerPeriod;
      }
    };
    // @private - In order to have exactly the same model behavior on very fast and very slow platforms, we use
    // EventTimer, which updates the model at regular intervals, and we can interpolate between states for additional
    // fidelity.
    this.eventTimer = new EventTimer( eventTimerModel, timeElapsed =>
      this.advanceTime( eventTimerPeriod, false )
    );

    // When frequency changes, choose a new phase such that the new sine curve has the same value and direction
    // for continuity
    const phaseUpdate = ( newFrequency, oldFrequency ) => {

      // For the main model, Math.sin is performed on angular frequency, so to match the phase, that computation
      // should also be based on angular frequencies
      const oldAngularFrequency = oldFrequency * Math.PI * 2;
      const newAngularFrequency = newFrequency * Math.PI * 2;
      const time = this.timeProperty.value;

      const oldValue = Math.sin( time * oldAngularFrequency + this.phase );
      let proposedPhase = Math.asin( oldValue ) - time * newAngularFrequency;
      const oldDerivative = Math.cos( time * oldAngularFrequency + this.phase );
      const newDerivative = Math.cos( time * newAngularFrequency + proposedPhase );

      // If wrong phase, take the sin value from the opposite side and move forward by half a cycle
      if ( oldDerivative * newDerivative < 0 ) {
        proposedPhase = Math.asin( -oldValue ) - time * newAngularFrequency + Math.PI;
      }

      this.phase = proposedPhase;
    };

    // @public the frequency in the appropriate units for the scene
    this.frequencyProperty = new NumberProperty( INITIAL_FREQUENCY, { range: frequencyRange } );
    this.frequencyProperty.lazyLink( phaseUpdate );

    // @public - controls the amplitude of the wave.
    this.amplitudeProperty = new NumberProperty( validate( config.initialAmplitude, POSITIVE_NUMBER ) , {
      range: SoundConstants.AMPLITUDE_RANGE
    } );

    // @public - elapsed time in seconds
    this.timeProperty = new NumberProperty( 0 );

    // @public - the grid that contains the wave values of the first speaker
    this.lattice = new Lattice(
      SoundConstants.LATTICE_DIMENSION,
      SoundConstants.LATTICE_DIMENSION,
      SoundConstants.LATTICE_PADDING,
      SoundConstants.LATTICE_PADDING
    );

    // @public - the grid that contains the wave values of the second speaker
    this.lattice2 = new Lattice(
      SoundConstants.LATTICE_DIMENSION,
      SoundConstants.LATTICE_DIMENSION,
      SoundConstants.LATTICE_PADDING,
      SoundConstants.LATTICE_PADDING
    );

    this.modelToLatticeTransform = ModelViewTransform2.createRectangleMapping(
      new Rectangle( 0, 0, SoundConstants.WAVE_AREA_WIDTH, SoundConstants.WAVE_AREA_WIDTH ),
      this.lattice.visibleBounds
    );

    this.modelViewTransform = null;
    this.latticeToViewTransform = null;

    this.speaker1Position = new Vector2(this.modelToLatticeTransform.viewToModelX(this.sourcePositionX), config.speaker1PositionY);
  }

  /**
   * After the view is initialized, determine the coordinate transformations that map to view coordinates.
   * @param {Bounds2} viewBounds
   * @public
   */
  setViewBounds( viewBounds ) {
    assert && assert( this.modelViewTransform === null, 'setViewBounds cannot be called twice' );

    this.modelViewTransform = ModelViewTransform2.createRectangleMapping(
      this.getWaveAreaBounds(),
      viewBounds
    );

    const latticeBounds = new Bounds2( 0, 0, 1, 1 );
    const modelBounds = this.modelToLatticeTransform.viewToModelBounds( latticeBounds );
    const tempViewBounds = this.modelViewTransform.modelToViewBounds( modelBounds );

    this.latticeToViewTransform = ModelViewTransform2.createRectangleMapping( latticeBounds, tempViewBounds );
  }

/**
   * Returns a Bounds2 for the visible part of the wave area, in the coordinates of the scene.
   * @returns {Bounds2} the lattice model bounds, in the coordinates of this scene.
   * @public
   */
  getWaveAreaBounds() {
    return new Bounds2( 0, 0, SoundConstants.WAVE_AREA_WIDTH, SoundConstants.WAVE_AREA_WIDTH );
  }
/**
   * Generate a wave from the point sources
   * @private
   */
  generateWaves() {
    const amplitude = this.amplitudeProperty.get();
    const time = this.timeProperty.get();
    const frequency = this.frequencyProperty.get();
    const period = 1 / frequency;
    const timeSincePulseStarted = time - this.pulseStartTime;
    //const lattice = this.lattice;
    //const lattice2 = this.lattice2;
    //const combinedLattice = this.combinedLattice;
    const isContinuous = ( !this.soundModeProperty || this.soundModeProperty.get() === SoundModel.SoundModeOptions.CONTINUOUS );

    // Used to compute whether a delta appears in either mask
    let temporalMask1Empty = true;
    let temporalMask2Empty = true;

    // If the pulse is running, end the pulse after one period
    if ( this.isPulseFiringProperty.get() ) {
      const timeSincePulseStarted = this.timeProperty.value - this.pulseStartTime;

      if ( timeSincePulseStarted > period ) {
        this.isPulseFiringProperty.set( false );
        this.pulseStartTime = 0;
      }
    }

    if ( isContinuous || this.isPulseFiringProperty.get() ) {

      // The simulation is designed to start with a downward wave, corresponding to water splashing in
      const angularFrequency = Math.PI * 2 * frequency;

      const dampingByPressure = this.pressureProperty ? this.pressureProperty.value : 1;
      //console.log(dampingByPressure);
      // Compute the wave value as a function of time, or set to zero if no longer generating a wave.
      const waveValue = ( this.isPulseFiringProperty.get() && timeSincePulseStarted > period ) ? 0 :
                        -Math.sin( time * angularFrequency + this.phase ) * amplitude *
                        WaveInterferenceConstants.AMPLITUDE_CALIBRATION_SCALE * dampingByPressure;

      // Point source
      if ( isContinuous|| this.isPulseFiringProperty.get() ) {

        const j = Math.floor(this.modelToLatticeTransform.modelToViewY( this.speaker1Position.y ));
        this.lattice.setCurrentValue( this.sourcePositionX, j, waveValue );
        //combinedLattice.setCurrentValue(WaveInterferenceConstants.POINT_SOURCE_HORIZONTAL_COORDINATE, j, 0, waveValue );
        this.oscillatorProperty.value = waveValue;
        if ( amplitude > 0 ) {
          this.temporalMask1.set( true, this.stepIndex,  j );
          temporalMask1Empty = false;
        }
      }

      // Secondary source (note if there is only one source, this sets the same value as above)
      if ( isContinuous && this.speaker2PositionProperty ) {
        const x = Math.floor(this.modelToLatticeTransform.modelToViewX( this.speaker2PositionProperty.get().x));
        const j = Math.floor(this.modelToLatticeTransform.modelToViewY( this.speaker2PositionProperty.get().y ));
        this.lattice2.setCurrentValue(x , j, waveValue );
        //combinedLattice.setCurrentValue(WaveInterferenceConstants.POINT_SOURCE_HORIZONTAL_COORDINATE, j, 1, waveValue );

        //this.oscillatorProperty.value = waveValue;
        if ( amplitude > 0 ) {
          amplitude > 0 && this.temporalMask2.set( true, this.stepIndex, j );
          temporalMask2Empty = false;
        }
      }
    }

    temporalMask1Empty && this.temporalMask1.set( false, this.stepIndex, 0 );
    temporalMask2Empty && this.temporalMask2.set( false, this.stepIndex, 0 );
  }
  
  /**
   * The user has initiated a single pulse.
   * @public
   */
  startPulse() {
    assert && assert( !this.isPulseFiringProperty.value, 'Cannot fire a pulse while a pulse is already being fired' );
    this.resetPhase();
    this.isPulseFiringProperty.value = true;
    this.pulseStartTime = this.timeProperty.value;
  }

  /**
   * Start the sine argument at 0 so it will smoothly form the first wave.
   * @private
   */
  resetPhase() {
    const frequency = this.frequencyProperty.get();
    const angularFrequency = Math.PI * 2 * frequency;

    // Solve for the sin arg = 0 in Math.sin( this.time * angularFrequency + this.phase )
    this.phase = -this.timeProperty.value * angularFrequency;
  }

  /**
   * Resets the model.
   * @public
   */
  reset() {
    this.isRunningProperty.reset();
    this.timeProperty.reset();
    this.frequencyProperty.reset();
    this.amplitudeProperty.reset();
    this.timeProperty.reset();
    
    if(this.soundModeProperty){
      this.soundModeProperty.reset();
    }

    if(this.audioControlSettingProperty){
      this.audioControlSettingProperty.reset();
    }
    if(this.isAudioEnabledProperty){
      this.isAudioEnabledProperty.reset();
    }
    if(this.stopwatch){
      this.stopwatch.reset();
    }
  }

  /**
   * Clears the waves from the screen.
   * @public
   */
  clearWaves() {
    this.lattice.clear();
    this.lattice2.clear();
  }

  /**
   * Steps the model.
   * @param {number} dt - time step, in seconds
   * @public
   */
  step( dt ) {

    // Feed the real time to the eventTimer and it will trigger advanceTime at the appropriate rate
    this.eventTimer.step( dt );
  }

  /**
   * By recording the times and positions of the wave disturbances, and knowing the wave propagation speed,
   * we can apply a masking function across the wave area, zeroing out any cell that could note have been generated
   * from the source disturbance.  This filters out spurious noise and restores "black" for the light scene.
   *
   * @private
   */
  applyTemporalMask() {

    // zero out values that are outside of the mask
    for ( let i = 0; i < this.lattice.width; i++ ) {
      for ( let j = 0; j < this.lattice.height; j++ ) {

        const cameFrom1 = this.temporalMask1.matches(this.sourcePositionX, i, j, this.stepIndex );
        if(this.speaker2PositionProperty){
          const cameFrom2 = this.temporalMask2.matches(this.modelToLatticeTransform.modelToViewX(this.speaker2PositionProperty.value.x), i, j, this.stepIndex );
                  this.lattice2.setAllowed(i , j, cameFrom2);

        }
        this.lattice.setAllowed(i, j, cameFrom1 );
      }
    }

    // Prune entries.  Elements that are too far out of range are eliminated.  Use the diagonal of the lattice for the
    // max distance
    this.temporalMask1.prune( Math.sqrt( 2 ) * this.lattice.width, this.stepIndex );
    this.temporalMask2.prune( Math.sqrt( 2 ) * this.lattice.width, this.stepIndex );
  }

  /**
   * Additionally called from the "step" button
   * @param {number} dt - amount of time that passed
   * @param {boolean} manualStep - true if the step button is being pressed
   * @public
   */
  advanceTime(dt, manualStep ) {
    if ( this.isRunningProperty.get() || manualStep ) {
      const correction = 2.4187847116091334 * 1000 / 500;
 //2.4187847116091334 * 2
      if(this.stopwatch){
        //(this.waveSpeed) / this.modelToLatticeTransform.viewToModelDeltaX(0.2);
        console.log(dt * correction);
        this.stopwatch.step( dt * correction);
      }
        // Notify listeners that a frame has advanced
        //this.stepEmitter.emit();
      //console.log(dt);
      this.lattice.interpolationRatio = this.eventTimer.getRatio();
      this.lattice2.interpolationRatio = this.eventTimer.getRatio();

      //this.sceneProperty.value.advanceTime( wallDT, manualStep );

      this.timeProperty.value += dt * correction;

      // Update the lattice
      this.lattice.step();
      this.lattice2.step();
      //this.combinedLattice.step();

      // Apply values on top of the computed lattice values so there is no noise at the point sources
      this.generateWaves();

      this.applyTemporalMask();

      // Notify listeners about changes
      this.lattice.changedEmitter.emit();
      this.lattice2.changedEmitter.emit();

      this.stepIndex++;

      //this.combinedLattice.changedEmitter.emit();
      // Notify listeners that a frame has advanced
      //this.stepEmitter.emit();
      //this.sceneProperty.value.lattice.interpolationRatio = this.eventTimer.getRatio();
      //this.sceneProperty.value.advanceTime( dt, manualStep );
    }
  }
}

/**
 * Audio Control can either be set to SPEAKER or LISTENER
 * @public
 */
SoundModel.AudioControlOptions = Enumeration.byKeys( [ 'SPEAKER', 'LISTENER' ] );

/**
 * Sound Mode can either be set to CONTINUOUS or PULSE
 * @public
 */
SoundModel.SoundModeOptions = Enumeration.byKeys( [ 'CONTINUOUS', 'PULSE' ] );

sound.register( 'SoundModel', SoundModel );
export default SoundModel;