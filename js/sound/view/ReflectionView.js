// Copyright 2020, University of Colorado Boulder

/**
 * @author Piet Goris
 * View for the reflection screen.
 */

import SoundScreenView from './SoundScreenView.js';
import sound from '../../sound.js';
import ReflectionModel from '../model/SingleSourceModel.js';
import ReflectionControlPanel from '../../common/view/ReflectionControlPanel.js';
import SoundModeControlPanel from '../../common/view/SoundModeControlPanel.js';
import Rectangle from '../../../../scenery/js/nodes/Rectangle.js';
import Shape from '../../../../kite/js/Shape.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import SoundConstants from '../../common/SoundConstants.js';

class ReflectionView extends SoundScreenView {
  constructor(model) {
    assert && assert( model instanceof ReflectionModel, 'invalid model' );
    super(model);

    this.reflectionControlPanel = new ReflectionControlPanel(model, this.contolPanelAlignGroup);
    this.soundModeControlPanel = new SoundModeControlPanel(model, this.contolPanelAlignGroup);

    this.reflector = new Rectangle(0, 0, SoundConstants.WAVE_AREA_WIDTH * 2, 4, {
      fill: '#f3d99b',
      stroke: 'black',
      lineWidth: 1
     });

    this.reflector.setY(model.modelViewTransform.modelToViewY(SoundConstants.WAVE_AREA_WIDTH));

    model.wallAngleProperty.link( prop => {
      this.reflector.setRotation(-prop);
      this.canvasNode.setWallAngle(prop);
    });

    this.reflectorContainer = new Node();
    this.reflectorContainer.addChild(this.reflector);
    this.reflectorContainer.setClipArea(Shape.rect(model.modelViewTransform.modelToViewX(0), model.modelViewTransform.modelToViewY(0), model.modelViewTransform.modelToViewDeltaX(SoundConstants.WAVE_AREA_WIDTH), model.modelViewTransform.modelToViewDeltaY(SoundConstants.WAVE_AREA_WIDTH)));

    model.wallPositionXProperty.link( prop => {
      this.reflector.setX(model.modelViewTransform.modelToViewX(prop));
      this.canvasNode.setWallPositionX(model.modelToLatticeTransform.modelToViewX(prop));
    });

    this.addChild(this.reflectorContainer);

		this.reflectionControlPanel.mutate( {
      right: this.layoutBounds.right - SoundConstants.CONTROL_PANEL_MARGIN,
      top: this.controlPanel.bottom + SoundConstants.CONTROL_PANEL_SPACING
    } );

    this.addChild(this.reflectionControlPanel);

    this.soundModeControlPanel.mutate( {
        right: this.layoutBounds.right - SoundConstants.CONTROL_PANEL_MARGIN,
        top: this.reflectionControlPanel.bottom + SoundConstants.CONTROL_PANEL_SPACING
    });
        
    this.addChild(this.soundModeControlPanel);
  }
}

sound.register( 'ReflectionView', ReflectionView );
export default ReflectionView;