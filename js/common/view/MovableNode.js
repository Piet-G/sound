// Copyright 2018-2020, University of Colorado Boulder

/**
 * A node which can be dragged within the given bounds.
 */

import Node from '../../../../scenery/js/nodes/Node.js';
import MovableDragHandler from '../../../../scenery-phet/js/input/MovableDragHandler.js';
import sound from '../../sound.js';

class MoveableNode extends Node {
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
      dragBounds: dragBounds,
      modelViewTransform: modelViewTransform
    } );

    this.children = [child];
    this.addInputListener( this.movableDragHandler );
  }

}

sound.register( 'MoveableNode', MoveableNode );
export default MoveableNode;