// Copyright 2018-2020, University of Colorado Boulder

/**
 * Shows the main controls, including frequency/wavelength and amplitude.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import Node from '../../../../scenery/js/nodes/Node.js';
import MovableDragHandler from '../../../../scenery-phet/js/input/MovableDragHandler.js';
import sound from '../../sound.js';

class MoveableNode extends Node {
  /**
   * @param {SoundModel} model
   * @param {AlignGroup} alignGroup
   */
  constructor(positionProperty, dragBounds, modelViewTransform, child) {
    super();

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

    this.children = [child];
    this.addInputListener( this.movableDragHandler );
  }

}

sound.register( 'MoveableNode', MoveableNode );
export default MoveableNode;