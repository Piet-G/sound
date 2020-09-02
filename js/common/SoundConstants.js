// Copyright 2020, University of Colorado Boulder

/**
 * Constants used throughout this simulation.
 *
 * @author Piet Goris
 */

import Range from '../../../../dot/js/Range.js';
import sound from '../sound.js';

const LATTICE_DIMENSION = 151;
const LATTICE_PADDING = 20;
const AMPLITUDE_CALIBRATION_SCALE = ( LATTICE_DIMENSION - LATTICE_PADDING * 2 ) / ( 101 - 20 * 2 );
const EVENT_RATE = 20 * AMPLITUDE_CALIBRATION_SCALE;

const SoundConstants = {

  SCREEN_VIEW_X_MARGIN: 15,
  SCREEN_VIEW_Y_MARGIN: 15,
  LATTICE_DIMENSION: LATTICE_DIMENSION,
  LATTICE_PADDING: LATTICE_PADDING,
  WAVE_AREA_WIDTH: 1000,
  SPEAKER_OFFSET: 55,
  AMPLITUDE_RANGE: new Range(0, 10),
  EVENT_RATE: EVENT_RATE,
  AMPLITUDE_CALIBRATION_SCALE: AMPLITUDE_CALIBRATION_SCALE
};

sound.register( 'SoundConstants', SoundConstants );
export default SoundConstants;