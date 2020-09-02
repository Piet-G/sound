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
import SoundConstants from '../../common/SoundConstants.js';
import listenerImage from '../../../images/girl_png.js';
import Image from '../../../../scenery/js/nodes/Image.js';


class TwoSourceView extends SoundScreenView {
  constructor(model) {
    assert && assert( model instanceof SingleSourceModel, 'invalid model' );
    super(model, Tandem.ROOT.createTandem('model'));

    const bounds = new Bounds2( model.speaker1Position.x, 0, 1, model.getWaveAreaBounds().height );

    const speaker = new SpeakerNode(model.oscillatorProperty);
    this.speakerNode2 = new MovableNode(model.speaker2PositionProperty, bounds, model.modelViewTransform, speaker);
    speaker.setRightCenter(new Vector2(SoundConstants.SPEAKER_OFFSET, 0));
    this.addChild(this.speakerNode2);

    const listenerBounds = new Bounds2( model.speaker1Position.x, 0,  model.getWaveAreaBounds().width, model.getWaveAreaBounds().height );

    const child = new Image(listenerImage);
	this.listener = new MovableNode(model.listenerPositionProperty, listenerBounds, model.modelViewTransform, child);
	child.setCenter(new Vector2(0,0));
	this.addChild(this.listener);
  }
}

sound.register( 'TwoSourceView', TwoSourceView );
export default TwoSourceView;