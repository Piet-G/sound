// Copyright 2020, University of Colorado Boulder

/**
 * @author Piet Goris
 */

import SoundModel from './SoundModel.js';
import Stopwatch from '../../../../scenery-phet/js/Stopwatch.js';
import Ruler from '../../../../beers-law-lab/js/beerslaw/model/Ruler.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import sound from '../../sound.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Range from '../../../../dot/js/Range.js';

class MeasureModel extends SoundModel {
  constructor() {
    super(Tandem.ROOT.createTandem('model'), {
      initialAmplitude: 10
    });

        // @public {Stopwatch}
    this.stopwatch = new Stopwatch( {
      position: new Vector2(100, 100),
      //numberDisplayOptions: {
      //  numberFormatter: createFormatter( 'cm' )
      //},
      timePropertyOptions: {
        range: new Range( 0, 999.99 )
        //units: 's'
      },
      isVisible: true
     });
     //const unitsProperty = new StringProperty( widestScene.timeUnits );

    //unitsProperty.link( units => this.setNumberFormatter( createFormatter( units ) ) );

    // @public
    this.ruler = new Ruler( 2.1, 0.1, 0.35,
      new Vector2( 100 - 2.6, 100 + 4 ),
      new Bounds2( 0, 0, 6, 5 ), {
        //tandem: Tandem.ROOT.createTandem( 'ruler' )
      }
    );
  }
}

sound.register( 'MeasureModel', MeasureModel );
export default MeasureModel;