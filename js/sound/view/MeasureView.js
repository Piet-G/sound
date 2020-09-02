// Copyright 2020, University of Colorado Boulder

/**
 * @author Piet Goris
 */

import SoundScreenView from './SoundScreenView.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import sound from '../../sound.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import SingleSourceModel from '../model/SingleSourceModel.js';
import DraggeableRuler from '../../common/view/DraggeableRuler.js';
import StopwatchNode from '../../../../scenery-phet/js/StopwatchNode.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';



//const MAJOR_TICK_WIDTH = 20; // in model coordinate frame

class MeasureView extends SoundScreenView {
  constructor(model) {
    assert && assert( model instanceof SingleSourceModel, 'invalid model' );
    super(model, Tandem.ROOT.createTandem('model'));


    const rulerLength = model.modelViewTransform.modelToViewDeltaX( 500 );
    const majorTickMarkWidth = rulerLength / ( 10 + 1 );
    // Compute tick labels, 1 major tick for every 0.5 unit of length, labels on the ticks that correspond to integer values.
    const majorTickLabels = [];
    const numberOfTicks = 10 + 1;
    for ( let i = 0; i < numberOfTicks; i++ ) {
      majorTickLabels[ i ] = ( i % 2 === 0 ) ? ( i / 2 ) : '';
    }

    const rulerNode = new DraggeableRuler(this.positionProperty, this.layoutBounds, ModelViewTransform2.createOffsetScaleMapping( new Vector2( 0, 0 ), 1 ), rulerLength, 50, majorTickMarkWidth, majorTickLabels, 'meter', {
      minorTicksPerMajorTick: 4,
      insetsWidth: 0
    });

    this.addChild(rulerNode);

    const createFormatter = units => StopwatchNode.getRichNumberFormatter( {
      showAsDecimal: true,
      units: units
    });

    const stopwatchNode = new StopwatchNode( model.stopwatch, {
        visibleBoundsProperty: this.visibleBoundsProperty,
        //tandem: Tandem.ROOT.createTandem( 'stopwatchNode' ),
        numberDisplayOptions: {
          numberFormatter: createFormatter( 'ms' )
        },
        dragListenerOptions: {
          start: () => {
            //grabSound.play();
          },
          end: () => {
            //releaseSound.play();
            //if ( toolboxIntersects( stopwatchNode.parentToGlobalBounds( stopwatchNode.bounds ) ) ) {
            //  model.stopwatch.reset();
          }
        }
      } );

      this.addChild(stopwatchNode);
  }
}

sound.register( 'MeasureView', MeasureView );
export default MeasureView;