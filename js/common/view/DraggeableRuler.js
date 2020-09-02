// Copyright 2018-2020, University of Colorado Boulder

/**
 * Shows the main controls, including frequency/wavelength and amplitude.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */


import RulerNode from '../../../../scenery-phet/js/RulerNode.js';
import MovableDragHandler from '../../../../scenery-phet/js/input/MovableDragHandler.js';

import sound from '../../sound.js';

class DraggeableRuler extends RulerNode {

  /**
   * @param {SoundModel} model
   * @param {AlignGroup} alignGroup
   */
  constructor( positionProperty, dragBounds, modelViewTransform, rulerWidth, rulerHeight, majorTickWidth, majorTickLabels, units, options ) {
    super(rulerWidth, rulerHeight, majorTickWidth, majorTickLabels, units, options);
        // interactivity
    this.cursor = 'pointer';

    // sync with model
    positionProperty.link( position => {
      const viewPosition = modelViewTransform.modelToViewPosition( position );
      this.x = viewPosition.x;
      this.y = viewPosition.y;
    } );

    // @private (phet-io)
    this.movableDragHandler = new MovableDragHandler( positionProperty, {
      //tandem: tandem.createTandem( 'movableDragHandler' ),
      dragBounds: dragBounds,
      modelViewTransform: modelViewTransform
    } );
    this.addInputListener( this.movableDragHandler );
  }

}

sound.register( 'DraggeableRuler', DraggeableRuler );
export default DraggeableRuler;