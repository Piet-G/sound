// Copyright 2020, University of Colorado Boulder

/**
 * @author Piet Goris
 */

import Tandem from '../../../../tandem/js/Tandem.js';
import sound from '../../sound.js';

class SoundModel {

  /**
   * @param {Tandem} tandem
   */
  constructor( tandem ) {
    assert && assert( tandem instanceof Tandem, 'invalid tandem' );
    //TODO
  }

  /**
   * Resets the model.
   * @public
   */
  reset() {
    //TODO
  }

  /**
   * Steps the model.
   * @param {number} dt - time step, in seconds
   * @public
   */
  step( dt ) {
    //TODO
  }
}

sound.register( 'SoundModel', SoundModel );
export default SoundModel;