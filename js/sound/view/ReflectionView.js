// Copyright 2020, University of Colorado Boulder

/**
 * @author Piet Goris
 */

import SoundScreenView from './SoundScreenView.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import sound from '../../sound.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import SingleSourceModel from '../model/SingleSourceModel.js';
import SpeakerNode from '../../common/view/SpeakerNode.js';
import MovableNode from '../../common/view/MovableNode.js';
import ReflectionControlPanel from '../../common/ReflectionControlPanel.js';
import SoundModeControlPanel from '../../common/SoundModeControlPanel.js';
import Rectangle from '../../../../scenery/js/nodes/Rectangle.js';
import Shape from '../../../../kite/js/Shape.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import SoundConstants from '../../common/SoundConstants.js';

class ReflectionView extends SoundScreenView {
  constructor(model) {
    assert && assert( model instanceof SingleSourceModel, 'invalid model' );
    super(model, Tandem.ROOT.createTandem('model'));

    const bounds = new Bounds2( model.speaker1Position.x, 0, 1, model.getWaveAreaBounds().height );

    //const speaker = new SpeakerNode(model.oscillatorProperty);
    //this.speakerNode2 = new MovableNode(model.speaker2PositionProperty, bounds, model.modelViewTransform, speaker);
    //speaker.setRightCenter(new Vector2(0,0));
    //this.addChild(this.speakerNode2);

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

    const updateReflectionControlPanelPosition = () => {
		this.reflectionControlPanel.mutate( {
          right: this.layoutBounds.right - 8,
          top: this.controlPanel.bottom + 7
        } );
      };
      updateReflectionControlPanelPosition();
     this.addChild(this.reflectionControlPanel);

    const updateSoundModeControlPanelPosition = () => {
    this.soundModeControlPanel.mutate( {
          right: this.layoutBounds.right - 8,
          top: this.reflectionControlPanel.bottom + 7
        } );
      };
      updateSoundModeControlPanelPosition();
     this.addChild(this.soundModeControlPanel);


  }
}

sound.register( 'ReflectionView', ReflectionView );
export default ReflectionView;